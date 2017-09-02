/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

const fs = require('fs');
const promisify = require('util').promisify;

const Koa = require('koa');

const log = require('@yjc/log');

const ServerOptions = require('./ServerOptions');
const RouterGetter = require('./RouterGetter');
const Controller = require('./Controller');

class Server {

    constructor() {
        this.options = null;
    }


    async start(options, basePath) {
        log.info(`getting server options`);
        let so = new ServerOptions();
        options = this.options = await so.getOptions(options, basePath);
        log.info(`server options\n${JSON.stringify(options, null, 2)}`);

        log.info(`init router`);
        let routerGetter = new RouterGetter(options);
        await routerGetter.init();

        log.info(`router depth: ${routerGetter.routerDepth}\n${routerGetter.printControllers()}`);
        if (routerGetter.warning.length) {
            if (options.logFile.runtimeError) {
                await promisify(fs.appendFile)(
                    options.logFile.runtimeError,
                    `[${log.timeStr()}] init router warning\n  ${routerGetter.warning.join('\n  ')}\n\n`,
                    'utf-8'
                );
            }
            log.warn(`router\n  ${routerGetter.warning.join('\n  ')}`)
        }
        routerGetter.initClear();

        let app = new Koa();
        app.use(routerGetter.middlewareRoute());

        if (options.static && routerGetter.routers) {
            let rootStaticPath;
            for (let staticPath in options.static) {
                if (staticPath === '/') {
                    rootStaticPath = staticPath;
                    continue;
                }

                let x = staticPath.substring(1, staticPath.indexOf('/', 1));
                if (!routerGetter.routers.children
                    || !routerGetter.routers.children[x]
                    || !routerGetter.routers.children[x].static
                ) {
                    continue;
                }

                log.info(`static(${staticPath}, ${options.static[staticPath]})`);
                app.use(routerGetter.middlewareSend(
                    staticPath, options.static[staticPath], options.indexStaticFileName
                ));
            }

            if (rootStaticPath && routerGetter.routers.static) {
                log.info(`static(/, ${options.static[rootStaticPath]})`);
                app.use(routerGetter.middlewareSend(
                    rootStaticPath, options.static[rootStaticPath], options.indexStaticFileName
                ));
            }
        }

        app.use(ctx => {
            ctx.status = 404;
            ctx.message = 'Not Found Fallback';
        });

        app.on('error', (err, ctx) => {
            log.error(err, `koa ${ctx ? `request/response cycle: ${ctx.originalUrl}` : 'app'}`);
        });

        return new Promise((resolve, reject) => {
            require('http').createServer(app.callback())
                .on('error', reject)
                .listen(options.listen, () => {
                    log.info(`server[${options.serverName}]: listening ${options.listen}`);
                    resolve(`server started`);
                });
        });

    }


    static async testOptions(options, basePath) {
        let so = new ServerOptions(true);
        return await so.getOptions(options, basePath);
    }

}

module.exports = Server;
