/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { InputServerOptions, FrozenServerOptions } from './types/ServerOptions';

export { Config } from './types/Config';
export { Controller } from './types/Controller';
export { Router } from './types/Router';
export { RouterReset } from './types/RouterReset';
export { util } from './types/util';

export declare function startServer(options: InputServerOptions, basePath?: string) : Promise<string>;
export declare function testOptions(options: InputServerOptions, basePath?: string) : Promise<FrozenServerOptions>;


/* declare only */

export { Middleware } from 'koa';

export { Context, State as ContextState } from './types/Context';
export { ResponseData } from './types/ResponseData';
export { RouterAction } from './types/RouterAction';
export { RouterActions } from './types/RouterActions';
export { RouterContext } from './types/RouterContext';
export { ServerContext } from './types/ServerContext';
export { InputServerOptions, FrozenServerOptions };
