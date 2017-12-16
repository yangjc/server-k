/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { ServerContext } from './ServerContext';

export declare interface RouterContext {
    // constructor(serverContext: ServerContext, routerPath: string);

    server: ServerContext;
    path: string;
}
