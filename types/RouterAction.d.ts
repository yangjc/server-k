/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { MiddlewareItem } from './MiddlewareItem';

export declare class RouterAction {
    constructor(httpMethod: string, hasActionArgs: boolean, ...middleware: MiddlewareItem[]);
    constructor(httpMethod: string, ...middleware: MiddlewareItem[]);

    name: string;
    method: string;
    hasArgs: boolean;

    middleware: (RouterAction | Function)[];
}
