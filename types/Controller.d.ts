/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { RouterContext } from './RouterContext';
import { ServerContext } from './ServerContext';
import { ResponseData } from './ResponseData';

export declare class Controller {

    constructor(routerContext: RouterContext);

    server: ServerContext;
    routerPath: string;

    render(data: object | null, templateName: string) : Promise<string>;

    data(code: number | Error, data: any, message: string | Error) : ResponseData;

    sendFile(context: object, filePath: string, rootPath?: string) : Promise<void>;

    send(rootPath: string) : Promise<any>;

    compose(...middleware: Function[]) : Function;

}
