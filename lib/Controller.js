/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

const koaCompose = require('koa-compose');
const koaSend = require('koa-send');

const Template = require('./Template');

const getMiddlewarePromise = (middleware) => {
    return (context, next) => {
        return Promise.resolve(middleware(context, next));
    };
};

/*
 * class extends Controller:
 *   all method functions should be middleware or middleware getter
 */

class Controller {
    constructor(routerContext) {
        Object.defineProperty(this, 'server', {value: routerContext.server});
        Object.defineProperty(this, 'routerPath', {value: routerContext.path});

        Object.defineProperty(this, 'closedActions', {value: {}});
        Object.defineProperty(this, 'boundActions', {value: {}});
    }

    async render(data, templateName) {
        // console.log('Controller.render()');

        let template = new Template(this.server);
        this.render = template.render.bind(template);

        return await this.render(data, templateName);
    }

    data(code, data, message) {
        const r = {};

        if (code && typeof code === 'object') {
            r.code = code.code || 'ERROR';
            if (this.server.isProduction) {
                r.data = null;
            } else {
                r.data = data;
                r.message = code.message;
                r.stack = code.stack;
            }
        } else {
            r.code = code;
            r.data = data || null;
        }

        if (typeof message === 'string') {
            r.message = message;
        }

        return r;
    }

    async sendFile(context, filePath, rootPath) {
        try {
            await koaSend(context, filePath, { root: rootPath || '/' });
        } catch (e) {
            context.status = 404;
        }
    }

    send(rootPath) {
        return (ctx, next) => {
            let p = ctx.state.actionArgsPath;
            if (!p || Controller.isForbiddenUrl(p)) {
                ctx.status = 400;
                return;
            }

            if (this.server.indexStaticFileName && p[p.length - 1] === '/') {
                p += this.server.indexStaticFileName;
            }

            return koaSend(ctx, p, { root: rootPath })
                .catch(e => next());
        };
    }

    composeOnCall(name, ...middleware) {
        let descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name);
        if (!descriptor || !descriptor['get']) {
            throw new Error(`getter not exists: ${name}`);
        }

        if (this.hasOwnProperty(name)) {
            throw new Error(`property exists: composeOnCall(${name})`);
        }
        const len = middleware.length;
        if (len === 0) {
            throw new Error(`middleware required: composeOnCall(${name})`);
        }

        for (let i = 0; i < len; i++) {
            const item = middleware[i];
            if (typeof item !== 'function') {
                throw new Error(`${i}th middleware error: composeOnCall(${name})`);
            }
            if (item.name && this[item.name] === item) {
                middleware[i] = this.getBoundAction(item.name, item);
            }
        }

        const m = len === 1
            ? getMiddlewarePromise(middleware[0])
            : koaCompose(middleware);

        Object.defineProperty(m, 'name', {value: name, configurable: false});
        Object.defineProperty(this, name, {value: m});

        return m;
    }

    // this.close('actionName', this.method, ...)
    closeActions(...methods) {
        for (let i = 0, l = methods.length; i < l; i++) {
            let m = methods[i];

            if (m && (typeof m === 'string' || (m = m.name))) {
                this.closedActions[m] = true;
            }
        }
    }

    getMiddleware(actionName) {
        if (typeof actionName !== 'string' || !actionName) {
            throw new Error(`action name error: ${actionName}`);
        }

        if (actionName.charAt(0) === '_') {
            throw new Error(`should not use private action: ${this.constructor.name}[${actionName}]`);
        }

        if (this.closedActions && typeof this.closedActions === 'object'
            && this.closedActions.hasOwnProperty(actionName)) {
            throw new Error(`should not use closed action: ${this.constructor.name}[${actionName}]`);
        }

        if (!Object.getPrototypeOf(this).hasOwnProperty(actionName)) {
            throw new Error(`member action not exists: ${this.constructor.name}[${actionName}]`);
        }

        if (typeof this[actionName] !== 'function') {
            throw new Error(`action should be middleware function: ${this.constructor.name}[${actionName}]`);
        }

        return getMiddlewarePromise(this.getBoundAction(actionName, this[actionName]));
    }

    getBoundAction(name, method) {
        return this.boundActions.hasOwnProperty(name)
            ? this.boundActions[name]
            : (this.boundActions[name] = method.bind(this));
    }

    static isUrlSlice(path) {
        return typeof path === 'string' && /^\/(\S+\/)?$/.test(path);
    }

    static isForbiddenUrl(path) {
        return /\/\.\./.test(path);
    }

}

module.exports = Controller;
