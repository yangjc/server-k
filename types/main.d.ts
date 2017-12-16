/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { ServerKTypes } from './Types';

export { ServerKTypes };
export { Config } from './Config';
export { Controller } from './Controller';
export { Router } from './Router';
export { RouterReset } from './RouterReset';
export { util } from './util';

export declare function startServer(options: ServerKTypes.InputServerOptions, basePath?: string)
    : Promise<string>;
export declare function testOptions(options: ServerKTypes.InputServerOptions, basePath?: string)
    : Promise<ServerKTypes.FrozenServerOptions>;
