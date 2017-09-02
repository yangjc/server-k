/**
 * YJC <yangjiecong@live.com> @2017-08-25
 */

'use strict';

class RouterContext {
    constructor(serverContext, routerPath) {
        Object.defineProperty(this, 'server', {value: serverContext});
        Object.defineProperty(this, 'path', {value: routerPath});
    }
}

module.exports = RouterContext;
