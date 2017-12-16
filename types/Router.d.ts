/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { RouterContext } from './RouterContext';
import { RouterAction } from './RouterAction';
// import { RouterActions } from './RouterActions';
import { MiddlewareItem } from './MiddlewareItem';

export declare class Router {
    constructor(routerContext: RouterContext);

    GET(hasActionArgs: boolean, ...middleware: MiddlewareItem[]): RouterAction;
    GET(...middleware: MiddlewareItem[]): RouterAction;

    POST(hasActionArgs: boolean, ...middleware: MiddlewareItem[]): RouterAction;
    POST(...middleware: MiddlewareItem[]): RouterAction;

    PUT(hasActionArgs: boolean, ...middleware: MiddlewareItem[]): RouterAction;
    PUT(...middleware: MiddlewareItem[]): RouterAction;

    DELETE(hasActionArgs: boolean, ...middleware: MiddlewareItem[]): RouterAction;
    DELETE(...middleware: MiddlewareItem[]): RouterAction;

    route(httpMethod: string, hasActionArgs: boolean, ...middleware: MiddlewareItem[]): RouterAction;
    route(httpMethod: string, ...middleware: MiddlewareItem[]): RouterAction;

    // take(actionsGetter: Function | RouterAction | RouterAction[], httpMethod?: string): RouterActions | never;

    static isActionName(name: string) : boolean;

    static getRouterName(fileName: string) : string | undefined;

    static isUrlSlice(path: string) : boolean;

    static isForbiddenUrl(path: string) : boolean;

    // static addAction(RouterClass: Router, actionName: string, actionFunction: Function) : void;

    // static Reset(RouterClass: Router, subServerName: string) : Router;

    // static getSubServerName(RouterClass: Router) : Symbol | null;

}
