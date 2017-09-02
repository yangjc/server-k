/**
 * YJC <yangjiecong@live.com> @2017-08-23
 */

'use strict';

const methods = require('http').METHODS.reduce((m, item) => {
    m[item] = null;
    return m;
}, {});

class RouterAction {
    constructor(httpMethod, hasActionArgs, ...middleware) {
        if (!httpMethod || typeof httpMethod !== 'string'
            || (!methods.hasOwnProperty(httpMethod = httpMethod.toUpperCase()))
        ) {
            throw TypeError(`http method error: ${httpMethod}`);
        }

        switch (typeof hasActionArgs) {
            case 'function':
                middleware.unshift(hasActionArgs);
                hasActionArgs = false;
                break;
            case 'boolean':
                break;
            case 'number':
                hasActionArgs = !!hasActionArgs;
                break;
            default:
                throw TypeError(`second argument should be boolean, number or function`);
        }

        if (middleware.length === 0) {
            throw TypeError('middleware is required');
        }

        this.method = httpMethod;
        this.hasArgs = hasActionArgs;
        this.middleware = middleware;

        this.name = undefined;
    }
}

module.exports = RouterAction;
