/**
 * YJC <yangjiecong@live.com> @2017-10-17
 */

import { Context as KoaContext } from 'koa';

declare interface state {
    actionName: string;
    actionArgsPath: string;
    actionArgs: string[];
}

export declare interface Context extends KoaContext {
    state: state;
}
