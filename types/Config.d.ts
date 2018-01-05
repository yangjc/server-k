/**
 * YJC <yangjiecong@live.com> @2017-11-08
 */

export declare class Config {

    constructor(...configDirPaths: string[]);

    public setConfigDir(...configDirPaths: string[]): void;

    public get(name: string): any;

    public getItem(name: string, itemName?: string): any;
    public getItem(object: any, itemName?: string): any;

    readonly configDir: string;

    static readonly ENV_PRODUCTION: string;

}
