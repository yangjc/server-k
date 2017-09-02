/**
 * YJC <yangjiecong@live.com> @2017-08-24
 */

'use strict';

const {Controller} = require('@yjc/server-k');

class MultiMiddleware extends Controller {

    async m0(ctx, next) {
        ctx.body = `${ctx.method} multi-middleware example\n`;
        await next();
    }

    async m1(ctx, next) {
        let stat = await require('util').promisify(require('fs').stat)(__filename);
        ctx.body += `\nasynchronous example:\nget file stat ${JSON.stringify(stat, null, 2)}\n`;
        await next();
    }

    async m2(ctx) {
        ctx.body += '\nend';
    }

}

module.exports = MultiMiddleware;
