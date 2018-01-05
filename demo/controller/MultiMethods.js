/**
 * YJC <yangjiecong@live.com> @2017-08-24
 */

'use strict';

const { Controller } = require('@yjc/server-k');

class MultiMethods extends Controller {

    async formPage(ctx) {
        ctx.body = await this.render({
            mainContainer: `<h1>Test Post</h1><form method="post" action=""><input type="submit"></form>`
        });
    }

    async post(ctx) {
        ctx.body = `method: ${ctx.method}`;
    }

    async head(ctx) {
        ctx.set('x-server', '@yjc/server-k');
        ctx.status = 200;
    }

}

module.exports = MultiMethods;
