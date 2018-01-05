/**
 * YJC <yangjiecong@live.com> @2017-08-23
 */

'use strict';

const methods = require('http').METHODS.reduce((m, item) => {
    m[item] = null;
    return m;
}, {});

class RouterAction {
    constructor(httpMethod, hasActionArgs, middleware) {
        if (!httpMethod || typeof httpMethod !== 'string'
            || (!methods.hasOwnProperty(httpMethod = httpMethod.toUpperCase()))
        ) {
            throw TypeError(`http method error: ${httpMethod}`);
        }

        if (typeof hasActionArgs !== 'boolean') {
            throw TypeError(`second argument should be boolean`);
        }

        if (typeof middleware !== 'function') {
            throw TypeError('middleware error');
        }

        this.name = undefined;
        this.method = httpMethod;
        this.hasArgs = hasActionArgs;

        this.middleware = middleware;

    }
}

module.exports = RouterAction;
