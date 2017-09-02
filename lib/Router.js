/**
 * YJC <yangjiecong@live.com> @2017-08-22
 */

'use strict';

const RouterAction = require('./RouterAction');

const KEY_S_OPT = Symbol();

/*
 * class extends Router:
 *   new Controller;
 *   define action;
 *   return middleware;
 *
 * nothing more
 */

class Router {
    constructor(routerContext) {}

    GET(hasActionArgs, ...middleware) {
        return new RouterAction('GET', hasActionArgs, ...middleware);
    }

    POST(hasActionArgs, ...middleware) {
        return new RouterAction('POST', hasActionArgs, ...middleware);
    }

    PUT(hasActionArgs, ...middleware) {
        return new RouterAction('PUT', hasActionArgs, ...middleware);
    }

    DELETE(hasActionArgs, ...middleware) {
        return new RouterAction('DELETE', hasActionArgs, ...middleware);
    }

    route(httpMethod, hasActionArgs, ...middleware) {
        return new RouterAction(httpMethod, hasActionArgs, ...middleware);
    }

    static isActionName(name) {
        return typeof name === 'string' && name !== 'constructor'
            && /^[a-zA-Z0-9][\w\-.]*$/.test(name);
    }

    static getRouterName(fileName) {
        let m = /^([a-zA-Z0-9][\w\-.]*)\.js$/.exec(fileName);
        return m ? m[1] : undefined;
    }

    static isUrlSlice(path) {
        return typeof path === 'string' && /^\/(\S+\/)?$/.test(path);
    }

    static isForbiddenUrl(path) {
        return /\/\.\./.test(path);
    }

    static addAction(RouterClass, actionName, actionFunction) {
        Object.defineProperty(RouterClass.prototype, actionName, {
            writable: true,
            enumerable: false,
            configurable: true,
            value: actionFunction
        });
    }

    static resetServer(RouterClass, serverOptions) {
        if (!(RouterClass.prototype instanceof Router)) {
            throw new TypeError(`Router.resetServer: first argument should be class extends Router`);
        }
        if (!serverOptions) {
            throw new TypeError(`Router.resetServer: second argument should be object, (async) function or string`);
        }

        let R;
        let Super = Object.getPrototypeOf(RouterClass);
        if (Super === Router) {
            R = class extends RouterClass {};
            Super = RouterClass;
        } else {
            R = RouterClass;
        }

        for (let name of Object.getOwnPropertyNames(Super.prototype)) {
            if (name === 'constructor' || R.prototype.hasOwnProperty(name)) {
                continue;
            }

            Router.addAction(R, name, Super.prototype[name]);
        }

        R[KEY_S_OPT] = serverOptions;

        return R;
    }

}

Object.defineProperty(Router, 'KEY_S_OPT', {value: KEY_S_OPT});

module.exports = Router;
