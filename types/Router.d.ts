/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { RouterContext } from './RouterContext';
import { RouterAction } from './RouterAction';
import { ControllerClass } from './Controller';

export declare class Router {
    constructor(routerContext: RouterContext);

    GET(hasActionArgs: boolean, ControllerClass: ControllerClass, actionName: string): RouterAction;
    GET(ControllerClass: ControllerClass, actionName: string): RouterAction;

    POST(hasActionArgs: boolean, ControllerClass: ControllerClass, actionName: string): RouterAction;
    POST(ControllerClass: ControllerClass, actionName: string): RouterAction;

    PUT(hasActionArgs: boolean, ControllerClass: ControllerClass, actionName: string): RouterAction;
    PUT(ControllerClass: ControllerClass, actionName: string): RouterAction;

    DELETE(hasActionArgs: boolean, ControllerClass: ControllerClass, actionName: string): RouterAction;
    DELETE(ControllerClass: ControllerClass, actionName: string): RouterAction;

    route(httpMethod: string, hasActionArgs: boolean, ControllerClass: ControllerClass, actionName: string)
    : RouterAction;
    route(httpMethod: string, ControllerClass: ControllerClass, actionName: string)
    : RouterAction;

    static isActionName(name: string) : boolean;

    static getRouterName(fileName: string) : string | undefined;

}
