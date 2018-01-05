/**
 * YJC <yangjiecong@live.com> @2017-08-24
 */

'use strict';

const { Controller } = require('@yjc/server-k');

class Message extends Controller {

    async forIndexInMiddle(ctx) {
        ctx.body = await this.render({mainContainer: 'The "index" in middle of url can\'t be skipped.'});
    }

    async forIndexOnTail(ctx) {
        ctx.body = await this.render({mainContainer: 'Only the last "index" in url can be skipped.'});
    }

}

module.exports = Message;
