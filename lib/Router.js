/**
 * YJC <yangjiecong@live.com> @2017-08-22
 */

'use strict';

const RouterAction = require('./RouterAction');
// const RouterActions = require('./RouterActions');

// const SUB_SERVER_NAME = Symbol();
// const TAKEN_ACTIONS = Symbol();

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

    // take(actionsGetter, httpMethod) {
    //     let actions;
    //
    //     if (!this.hasOwnProperty(TAKEN_ACTIONS)) {
    //         Object.defineProperty(this, TAKEN_ACTIONS, {value: [], configurable: true});
    //     }
    //
    //     for (let item of this[TAKEN_ACTIONS]) {
    //         if (item[0] === actionsGetter) {
    //             actions = item[1];
    //             break;
    //         }
    //     }
    //
    //     if (!actions) {
    //         if (typeof actionsGetter === 'function') {
    //             try {
    //                 actions = actionsGetter.call(this);
    //             } catch (e) {
    //                 e.message = `execute actions getter error\n${e.message}`;
    //                 throw e;
    //             }
    //
    //             actions = new RouterActions(actions);
    //
    //         } else {
    //             actions = new RouterActions(actionsGetter);
    //
    //         }
    //
    //         this[TAKEN_ACTIONS].push([actionsGetter, actions]);
    //     }
    //
    //     if (actions.error) {
    //         throw Error(`take actions error\n${actions.error.join('\n')}`);
    //     }
    //
    //     if (httpMethod) {
    //         if (typeof httpMethod === 'string'
    //             && actions.hasOwnProperty(httpMethod = httpMethod.toUpperCase())
    //         ) {
    //             return actions[httpMethod];
    //         }
    //
    //         throw Error(`take http method "${httpMethod}" error`);
    //     }
    //
    //     return actions;
    // }

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

    // static addAction(RouterClass, actionName, actionFunction) {
    //     Object.defineProperty(RouterClass.prototype, actionName, {
    //         writable: true,
    //         enumerable: false,
    //         configurable: true,
    //         value: actionFunction
    //     });
    // }

    // static Reset(RouterClass, subServerName) {
    //     if (!(RouterClass.prototype instanceof Router)) {
    //         throw new TypeError(`Router.Reset: first argument should be class extends Router`);
    //     }
    //     if (!subServerName || typeof subServerName !== 'string') {
    //         throw new TypeError(`Router.Reset: second argument should be sub-server name`);
    //     }
    //
    //     let R;
    //     let Super = Object.getPrototypeOf(RouterClass);
    //     if (Super === Router) {
    //         R = class extends RouterClass {};
    //         Super = RouterClass;
    //     } else {
    //         R = RouterClass;
    //     }
    //
    //     for (let name of Object.getOwnPropertyNames(Super.prototype)) {
    //         if (name === 'constructor' || R.prototype.hasOwnProperty(name)) {
    //             continue;
    //         }
    //
    //         Router.addAction(R, name, Super.prototype[name]);
    //     }
    //
    //     Object.defineProperty(R, SUB_SERVER_NAME, {value: subServerName});
    //
    //     return R;
    // }

    // static getSubServerName(RouterClass) {
    //     return RouterClass.hasOwnProperty(SUB_SERVER_NAME) ? RouterClass[SUB_SERVER_NAME] : null;
    // }

}

module.exports = Router;
