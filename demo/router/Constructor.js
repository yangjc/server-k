/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

const { Router } = require('@yjc/server-k');

module.exports = class extends Router {

    constructor(r) {
        super(r);
    }

    // change case to avoid name conflict
    CONSTRUCTOR() {
        return this.GET(ctx => ctx.body = 'Hello World!');
    }

};
