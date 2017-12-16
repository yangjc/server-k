/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

export declare interface OptionsDir {
    base        : string;
    router      : string;

    template    ?: string;
    frontend    ?: string;
    controller  ?: string;
    model       ?: string;
    middleware  ?: string;
    config      ?: string;
}

declare interface OptionsStatic {
    [path: string]  : string;
}

declare interface OptionsAsset {
    [path: string]  : string | OptionsAssetItem;
}

declare interface OptionsAssetItem {
    path: string;
    alias: string;
}

declare interface OptionsLogFile {
    runtimeError: string;
}

declare interface getSubServer {
    (options: InputServerOptions): InputServerOptions;
}

declare interface SubServerItem {
    [name: string] : string | getSubServer | InputServerOptions;
}

export declare interface InputServerOptions {
    serverName  : string;
    listen      : string | number;
    dir         : OptionsDir;

    static      ?: OptionsStatic;
    asset       ?: OptionsAsset;
    logFile     ?: OptionsLogFile;

    indexFileName       ?: string;
    indexActionName     ?: string;
    indexStaticFileName ?: string;
    subServer           ?: SubServerItem;
}

declare interface FrozenSubServerItem {
    [name: string] : FrozenServerOptions;
}

export declare interface FrozenServerOptions extends InputServerOptions {
    nodeEnv     : string;
    subServer   ?: FrozenSubServerItem;
}
