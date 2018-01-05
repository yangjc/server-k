/**
 * YJC <yangjiecong@live.com> @2017-08-22
 */

'use strict';

const Controller = require('./Controller');
const RouterAction = require('./RouterAction');
const RouterContext = require('./RouterContext');

/*
 * class extends Router:
 *   Only declarations, NO Logic.
 */

class Router {
    constructor(routerContext, controllers) {
        if (!(routerContext instanceof RouterContext) || !Array.isArray(controllers)) {
            throw new Error(`new Router(routerContext, controllerArray) parameters error`);
        }

        this.context = routerContext;
        this.controllers = controllers;
    }

    GET(hasActionArgs, ControllerClass, actionName) {
        return this.route('GET', hasActionArgs, ControllerClass, actionName);
    }

    POST(hasActionArgs, ControllerClass, actionName) {
        return this.route('POST', hasActionArgs, ControllerClass, actionName);
    }

    PUT(hasActionArgs, ControllerClass, actionName) {
        return this.route('PUT', hasActionArgs, ControllerClass, actionName);
    }

    DELETE(hasActionArgs, ControllerClass, actionName) {
        return this.route('DELETE', hasActionArgs, ControllerClass, actionName);
    }

    route(httpMethod, hasActionArgs, ControllerClass, actionName) {
        if (typeof hasActionArgs === 'function') {
            actionName = ControllerClass;
            ControllerClass = hasActionArgs;
            hasActionArgs = false;
        }

        let controller;
        for (let item of this.controllers) {
            if (item[0] === ControllerClass) {
                controller = item[1];
                break;
            }
        }

        if (controller === undefined) {
            try {
                controller = new ControllerClass(this.context);
            } catch (e) {
                e.message = `new Controller for Router error\n${e.message}`;
                throw e;
            }
            this.controllers.push([ControllerClass, controller]);
        }

        if (!(controller instanceof Controller)) {
            throw new Error(`should pass Controller Class`);
        }

        return new RouterAction(httpMethod, hasActionArgs, controller.getMiddleware(actionName));
    }

    static isActionName(name) {
        return typeof name === 'string' && name !== 'constructor'
            && /^[a-zA-Z0-9][\w\-.]*$/.test(name);
    }

    static getRouterName(fileName) {
        let m = /^([a-zA-Z0-9][\w\-.]*)\.js$/.exec(fileName);
        return m ? m[1] : undefined;
    }

}

module.exports = Router;
