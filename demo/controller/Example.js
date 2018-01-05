/**
 * YJC <yangjiecong@live.com> @2017-08-24
 */

'use strict';

const { Controller } = require('@yjc/server-k');

class Example extends Controller {

    async main(ctx) {
        ctx.body = await this.render({
            title: `INDEX`,
            mainContainer: `[${this.server.serverName}] Default router, render by mustache.<br>`
            + `Action arguments: ${JSON.stringify(ctx.state.actionArgs)}`,
            scripts: ['js/test']
        });
    }

    info(ctx) {
        ctx.body = `[${this.server.serverName}]\n`
            + `url: ${ctx.url}\n`
            + `router: ${this.routerPath} ${ctx.state.actionName}()\n`
            + `action arguments: ${ctx.state.actionArgs.length ? ctx.state.actionArgs.join(', ') : 'none'}`;
    }

    throw() {
        throw new Error('throw error');
    }

    nameRules(ctx) {
        ctx.body = `file name matches: /^[a-zA-Z0-9][\\w\\-.]*\\.js$/\n`
            + `action name matches: /^[a-zA-Z0-9][\\w\\-.]*$/`;
    }

    argsUsage(ctx) {
        ctx.body = `context.state.actionName = ${ctx.state.actionName}\n`
            + `context.state.actionArgsPath = ${ctx.state.actionArgsPath}\n`
            + `context.state.actionArgs (already decodeURIComponent) = \n  `
            + `${JSON.stringify(ctx.state.actionArgs)}`;
    }

    getConfig(ctx) {
        ctx.body = this.data(0, this.server.getEnvConfig('test'));
    }

    hello(ctx) {
        ctx.body = 'Hello World!';
    }

}

module.exports = Example;
