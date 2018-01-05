/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { Middleware } from 'koa';

import { RouterContext } from './RouterContext';
import { ServerContext } from './ServerContext';
import { ResponseData } from './ResponseData';

export declare interface ControllerClass {
    new(routerContext: RouterContext): Controller;
}

export declare class Controller {

    constructor(routerContext: RouterContext);

    readonly server: ServerContext;
    readonly routerPath: string;

    private closedActions: any;
    private boundActions: any;

    render(data: object | null, templateName?: string) : Promise<string>;

    data(code: number, data: any, message?: string) : ResponseData;
    data(error: Error, data?: any, message?: string) : ResponseData;

    sendFile(context: object, filePath: string, rootPath?: string) : Promise<void>;

    send(rootPath: string) : Middleware;

    composeOnCall(name: string, ...middleware: Middleware[]): Middleware;

    closeActions(...methods: (string | Function)[]): void;

    private getMiddleware(actionName: string): Middleware;

    private getBoundAction(actionName: string, method: Middleware): Middleware;

    static isUrlSlice(path: string) : boolean;

    static isForbiddenUrl(path: string) : boolean;

}
