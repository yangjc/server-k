/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

export declare class RouterAction {
    constructor(httpMethod: string, hasActionArgs: boolean, middleware: Function);
    constructor(httpMethod: string, middleware: Function);

    name: string;
    method: string;
    hasArgs: boolean;

    middleware: Function;
}
