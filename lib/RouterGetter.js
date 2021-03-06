/**
 * YJC <yangjiecong@live.com> @2017-08-11
 */

'use strict';

const fs = require('fs');
const promisify = require('util').promisify;

const koaSend = require('koa-send');

const log = require('@yjc/log');

const Router = require('./Router');
const RouterReset = require('./RouterReset');
const Controller = require('./Controller');
const ServerContext = require('./ServerContext');
const RouterContext = require('./RouterContext');
const RouterAction = require('./RouterAction');
const RouterActions = require('./RouterActions');
const sUtil = require('../util');

class RouterGetter {
    constructor(options, subServer) {
        this.options = options;
        this.serverContext = new ServerContext(options);
        this.subServerContext = {};
        this.indexFileName = options.indexFileName || 'index';
        this.indexActionName = options.indexActionName || 'main';
        this.routerDir = options.dir.router;

        for (let name in subServer) {
            this.subServerContext[name] = new ServerContext(subServer[name]);
        }

        this.routers = null;
        this.routerDepth = 0;
        this.warning = [];
        this.controllers = [];
    }

    initClear() {
        this.subServerContext = null;
        this.warning = null;
        this.controllers = null;
    }

    async init() {
        this.routers = await (async function read(dir, depth, routerReset) {
            let root = {
                children: {}
            };

            let routerDir = routerReset ? routerReset.routerDir : this.routerDir;
            let list = await promisify(fs.readdir)(routerDir + dir);

            if (list.length === 0) {
                return null;
            }

            for (let item of list) {
                let p = `${dir}/${item}`;
                item = item.toLowerCase();

                let stat = await promisify(fs.stat)(routerDir + p);
                let child = null;

                if (stat.isDirectory()) {
                    child = await read.call(this, p, depth + 1, routerReset);
                    if (!child) {
                        this.warning.push(`ignore empty router directory: ${p}/`);
                    }
                } else if (stat.isFile() && (item = Router.getRouterName(item))) {
                    let m;
                    if (routerReset) {
                        m = this.requireRouter(
                            routerDir + p,
                            `${routerReset.routerPath}${dir.toLowerCase()}/${item}`,
                            routerReset.serverContext
                        );
                    } else {
                        m = this.requireRouter(routerDir + p, `${dir.toLowerCase()}/${item}`);
                    }

                    // m && (root.children[item] = Object.assign(
                    //     root.children.hasOwnProperty(item) ? root.children[item] : {},
                    //     {
                    //         path: p,
                    //         module: m
                    //     }
                    // ));

                    // file first
                    if (m.error) {
                        this.warning.push(`ignored error in ${p}:\n${m.error}`);
                    }

                    if (m instanceof RouterReset) {
                        child = await read.call(this, '', depth + 1, m);
                    } else if (m.module) {
                        if (root.children.hasOwnProperty(item)) {
                            this.warning.push(`ignore duplicate router directory: ${root.children[item].path}`);
                        }
                        root.children[item] = {
                            module: m.module,
                            path: (routerReset ? `<${routerReset.subServerName}>` : '') + p
                        };
                    } else {
                        this.warning.push(`ignore empty router module: ${p}`);
                    }
                } else {
                    this.warning.push(`skip router: ${p}`);
                }

                if (child) {
                    // root.children[item] = Object.assign(
                    //     root.children.hasOwnProperty(item) ? root.children[item] : {},
                    //     child
                    // );

                    // file first
                    if (root.children.hasOwnProperty(item)) {
                        this.warning.push(`ignore duplicate router directory: ${p}/`);
                    } else {
                        root.children[item] = child;
                    }
                }
            }

            if (Object.keys(root.children).length) {
                if (depth > this.routerDepth) {
                    this.routerDepth = depth;
                }

                root.path = dir + '/';
                return root;
            }

            return null;
        }).call(this, '', 1);

        this.routeStatic();
    }

    static getActions(router, actionName) {
        let actions = new RouterActions(router[actionName]());

        if (actions.error || actions.length === 0) {
            return actions;
        }

        let error = [];

        for (let method in actions) {
            let a = actions[method];
            if (!actions.hasOwnProperty(method) || !(a instanceof RouterAction)) {
                continue;
            }
            a.name = actionName;
        }

        if (error.length) {
            actions.error = error;
        }

        return actions;
    }

    requireRouter(modulePath, routerPath, serverContext) {
        let router;
        try {
            let R = require(modulePath);
            if (R && typeof R.default === 'function') {
                R = R.default;
            }

            if (R instanceof RouterReset) {
                return R.init(this.subServerContext, routerPath);
            }

            router = new R(
                new RouterContext(
                    serverContext || this.serverContext,
                    routerPath
                ),
                this.controllers
            );
        } catch (e) {
            return {
                module: null,
                error: `  - ${e.stack}`
            };
        }

        if (!(router instanceof Router)) {
            return {
                module: null,
                error: `  - should be instance of Router`
            };
        }

        let error = [];

        if (error.length) {
            return {
                module: null,
                error: `  - ${error.join('\n  - ')}`
            }
        }

        let result = {};

        let isNull = true;

        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(router))) {
            if (Router.isActionName(name)
                && typeof router.constructor.prototype[name] === 'function'
            ) {
                let actions;
                try {
                    actions = RouterGetter.getActions(router, name);
                } catch (e) {
                    error.push(`${name}() execute: ${e.stack}`);
                    continue;
                }

                if (actions.error) {
                    error.push(`${name}(): get actions error\n  -- ${actions.error.join('\n  -- ')}`);
                    actions.error = null;
                }

                if (actions.length === 0) {
                    continue;
                }

                isNull = false;
                result[name.toLowerCase()] = actions;
            }
        }

        router = null;

        if (isNull) {
            error.push(`no action`);
        }

        return {
            module: isNull ? null : result,
            error: error.length ? `  - ${error.join('\n  - ')}` : null
        }
    }

    routeStatic() {
        if (!this.options.static) {
            return;
        }

        let routers = this.routers || {children: {}};

        let hasWithArgIndex = false;
        // let hasNoArgIndex = false;
        if (routers.children.hasOwnProperty(this.indexFileName)) {
            let c = routers.children[this.indexFileName];
            if (c.module && c.module.hasOwnProperty(this.indexActionName) && c.module[this.indexActionName].GET) {
                if (c.module[this.indexActionName].GET.hasArgs) {
                    hasWithArgIndex = true;
                // } else {
                //     hasNoArgIndex = true;
                }
            }
        }

        let hasStatic = false;

        for (let p in this.options.static) {
            p = p.toLowerCase();
            if (p === '/') {
                if (hasWithArgIndex) {
                    this.warning.push(`static path \`/\` is not reachable`);
                    continue;
                }
                if (this.routers || Object.keys(this.options.static).length > 1) {
                    this.warning.push(`static path \`/\` may not reachable`);
                }
                routers.static = '/';
                hasStatic = true;
                if (this.routerDepth === 0) {
                    this.routerDepth = 1;
                }
                continue;
            }

            let x = p.split('/');
            if (routers.children.hasOwnProperty(x[1])) {
                this.warning.push(`static path \`${p}\` is not reachable`);
            } else {
                routers.children[x[1]] = {static: p};
                hasStatic = true;
                if (this.routerDepth < x.length - 2) {
                    this.routerDepth = x.length - 2;
                }
            }
        }

        if (hasStatic) {
            this.routers = routers;
        }

    }

    errorResponse(context, error, title, routerPath, actionName, actionArgs) {
        let message = `[${log.timeStr()}] ${title}\n`
            + `${context.method} ${context.originalUrl}\n`
            + `router module: ${routerPath}\n`
            + `action: ${actionName}\n`
            + `arguments: ${JSON.stringify(actionArgs)}\n`
            + `${error.stack}\n\n`;

        if (this.serverContext.isProduction) {
            if (this.options.logFile.runtimeError) {
                return promisify(fs.appendFile)(
                    this.options.logFile.runtimeError,
                    message,
                    'utf8'
                );
            }

            return;
        }

        context.body = `${message}error messages displayed if (process.env.NODE_ENV !== "${sUtil.ENV_PRODUCTION}")`;
    }

    middlewareRoute() {
        return (ctx, next) => {
            if (!this.routers) {
                return next();
            }

            let u = ctx.request.path.substr(1).split('/');

            // console.log(`::: ${ctx.originalUrl} ${u.length}`);

            let i = 0;
            let l = Math.min(u.length - 1, this.routerDepth);
            let c = this.routers;
            for (; i < l; i++) {
                let item = u[i].toLowerCase();
                if (c.children) {
                    if (c.children.hasOwnProperty(item)) {
                        // console.log(`> loop child ${item}`);
                        c = c.children[item];
                    // } else if (c.children.hasOwnProperty(this.indexFileName)) {
                    //     Don't skip index in the middle, skip the last index only.
                    //     --i;
                    //     console.log(`> loop go back ${item} ${i}`);
                    //     c = c.children[this.indexFileName];
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }

            // console.log(i);
            if (!c.module) {
                if (c.children
                    && c.children.hasOwnProperty(this.indexFileName)
                    && (c = c.children[this.indexFileName]).module
                ) {
                    // console.log(`> out fallback ${this.indexFileName}`);

                } else {

                    return next();
                }

            }

            // console.log(i, c.path);

            let action = RouterGetter.getAction(c.module, ctx.method, u[i], u.length - i - 1);
            // console.log(`try(action-name: ${u[i]}, first-arg: ${u[i + 1]}): ${action ? 'ok' : null}`);

            if (action === null) {
                if (u[i] === '' && u[i + 1] === undefined) {
                    // skip checking has args or not
                    action = RouterGetter.getAction(c.module, ctx.method, this.indexActionName, -1);
                    // console.log(`try(skip-action-no-tail): ${action ? 'ok' : null}`);

                    if (action === null) {
                        return next();
                    }

                    action.hasArgs === false && ++i;

                } else {
                    action = RouterGetter.getAction(c.module, ctx.method, this.indexActionName, u.length - i);
                    // console.log(`try(skip-action-with-tail, first-arg: ${u[i]}): ${action ? 'ok' : null}`);

                    if (action === null) {
                        return next();
                    }

                }

            } else {
                ++i;
            }

            let args;

            ctx.state.actionName = action.name;
            if (u[i] === undefined) {
                args = null;
                ctx.state.actionArgsPath = '';
                ctx.state.actionArgs = [];
            } else {
                args = u.slice(i);
                ctx.state.actionArgsPath = '/' + args.join('/');
                args = args.map(item => decodeURIComponent(item));
                ctx.state.actionArgs = args;
            }

            // console.log(args);

            if (!action.middleware) {
                ctx.status = 500;
                return this.errorResponse(ctx, new Error('middleware undefined'),
                    'action error', c.path, action.name, args);

            }

            return action.middleware(ctx, next)
                .catch(e => {
                    ctx.status = 500;
                    return this.errorResponse(ctx, e, 'middleware error', c.path, action.name, args);
                });

        };
    }

    middlewareSend(staticPath, rootPath) {
        if (!Controller.isUrlSlice(staticPath) || !rootPath || typeof rootPath !== 'string') {
            throw new TypeError('path should be string');
        }
        staticPath = staticPath.toLowerCase();
        let staticLength = staticPath.length;

        return (ctx, next) => {
            if (ctx.path.substr(0, staticLength).toLowerCase() === staticPath) {
                if (Controller.isForbiddenUrl(ctx.path)) {
                    ctx.status = 400;
                    return;
                }

                let p = ctx.path;
                if (this.options.indexStaticFileName && p[p.length - 1] === '/') {
                    p += this.options.indexStaticFileName;
                }

                return koaSend(ctx, p.substr(staticLength), { root: rootPath })
                    .catch(e => next());
            }

            return next();
        }
    }

    static getAction(module, method, fnName, argsLen) {
        if (typeof fnName !== 'string') {
            return null;
        }

        fnName = fnName.toLowerCase();

        if (module.hasOwnProperty(fnName) && module[fnName].hasOwnProperty(method)) {
            let a = module[fnName][method];

            if (argsLen === -1
                || (a.hasArgs === false && argsLen === 0)
                || (a.hasArgs === true && argsLen > 0)
            ) {
                return a;
            }
        }

        return null;
    }

    printControllers(space) {
        if (Number.isInteger(space)) {
            return JSON.stringify(this.routers, (key, value) => {
                if (value instanceof RouterAction) {
                    return '[object RouterAction]';
                }
                return value;
            }, space);
        }

        if (!this.routers) {
            return '  router null';
        }

        let read = (c, parentPath) => {
            let txt = '';
            let staticList = [];

            let names = Object.keys(c.children).sort(function (a, b) {
                let x = c.children[a];
                let y = c.children[b];
                if (x.module && !y.module) {
                    return -1;
                }
                if (!x.module && y.module) {
                    return 1;
                }
                return x.path > y.path ? 1 : (x.path < y.path ? -1 : 0);
            });

            for (let name of names) {
                if (!c.children.hasOwnProperty(name)) {
                    continue;
                }
                let item = c.children[name];
                if (item.children) {
                    txt += (txt ? '\n' : '') + read(item, `${parentPath}/${name}`);
                } else if (item.module) {
                    txt += `${txt ? '\n' : ''}${item.path}`;
                    for (let fn in item.module) {
                        for (let method in item.module[fn]) {
                            let hasArgs = item.module[fn][method].hasArgs;
                            txt += `${txt ? '\n' : ''}  ${method} ${parentPath}/`
                                + (name === this.indexFileName ? `[${name}/]`: `${name}/`)
                                + (fn === this.indexActionName
                                    ? `[${fn}${hasArgs ? '/' : ''}]`
                                    : `${fn}${hasArgs ? '/' : ''}`
                                )
                                + (hasArgs ? '...' : '');
                        }
                    }
                } else if (item.static) {
                    staticList.push(`GET ${item.static}...`);
                }
            }

            if (c.static) {
                staticList.push(`GET ${c.static}...`);
            }

            return `${txt}${staticList.length ? `${txt ? '\n' : ''}\\static\n  ${staticList.join('\n  ')}` : ''}`;
        };

        return read(this.routers, '');
    }

}

module.exports = RouterGetter;
