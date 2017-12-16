/**
 * YJC <yangjiecong@live.com> @2017-08-23
 */

'use strict';

const methods = require('http').METHODS.reduce((m, item) => {
    m[item] = null;
    return m;
}, {});

// let RouterActions;

class RouterAction {
    constructor(httpMethod, hasActionArgs, ...middleware) {
        if (!httpMethod || typeof httpMethod !== 'string'
            || (!methods.hasOwnProperty(httpMethod = httpMethod.toUpperCase()))
        ) {
            throw TypeError(`http method error: ${httpMethod}`);
        }

        switch (typeof hasActionArgs) {
            // case 'object':
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
                throw TypeError(`second argument should be boolean, number, middleware`);
        }

        if (middleware.length === 0) {
            throw TypeError('middleware is required');
        }

        this.name = undefined;
        this.method = httpMethod;
        this.hasArgs = hasActionArgs;

        this.middleware = middleware;

        // this.middleware = [];
        //
        // RouterActions = RouterActions || require('./RouterActions');
        //
        // for (let item of middleware) {
        //     if (item instanceof RouterAction) {
        //         this.middleware = this.middleware.concat(item.middleware);
        //     } else if (item instanceof RouterActions) {
        //         if (!item.hasOwnProperty(httpMethod)) {
        //             throw new Error(`take http method "${httpMethod}" error`);
        //         }
        //         this.middleware = this.middleware.concat(item[httpMethod].middleware);
        //     } else {
        //         this.middleware.push(item);
        //     }
        // }

    }
}

module.exports = RouterAction;
