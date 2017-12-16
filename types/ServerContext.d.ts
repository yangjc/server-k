/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { FrozenServerOptions } from './ServerOptions';

export declare interface ServerContext extends FrozenServerOptions {
    // constructor(options: FrozenServerOptions);

    isProduction : boolean;
    envConfCache : object;

    getEnvConfig(name: string) : any;
    getConfig(name: string) : any;
}
