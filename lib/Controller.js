/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

const koaCompose = require('koa-compose');
const koaSend = require('koa-send');

const Template = require('./Template');
const Router = require('./Router');

/*
 * class extends Controller:
 *   all method functions should be middleware
 */

class Controller {
    constructor(routerContext) {
        Object.defineProperty(this, 'server', {value: routerContext.server});
        Object.defineProperty(this, 'routerPath', {value: routerContext.path});
    }

    async render(data, templateName) {
        // console.log('Controller.render()');

        let template = new Template(this.server);
        this.render = template.render.bind(template);

        return await this.render(data, templateName);
    }

    data(code, data, message) {
        let r = {
            code: code,
            data: data || null,
        };

        if (typeof message === 'string') {
            r.message = message;
        } else if (message && message.message) {
            if (this.server.isProduction) {
                r.message = 'Error';
            } else {
                r.message = message.message;
                r.stack = message.stack;
            }
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
            if (!p || Router.isForbiddenUrl(p)) {
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

    compose(...middleware) {
        if (Array.isArray(middleware[0])) {
            return koaCompose(middleware[0]);
        }
        return koaCompose(middleware);
    }

}

module.exports = Controller;
