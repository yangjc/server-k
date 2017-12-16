/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

export declare namespace util {
    
    function extend(source: object, ext: object) : object;
    function freeze(object: object) : object;
    function getServerConfig(defaultConfig: object, envConfig: object) : object;

    const ENV_PRODUCTION: string;

}
