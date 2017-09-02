/**
 * YJC <yangjiecong@live.com> @2017-08-24
 */

'use strict';

const ServerOptions = require('../lib/ServerOptions');
const util = require('../util');

class ServerContext {
    constructor(options) {
        for (let name in options) {
            Object.defineProperty(this, name, {
                configurable: false,
                enumerable: true,
                writable: false,
                value: options[name]
            });
        }

        Object.defineProperty(this, 'isProduction', {value: options.nodeEnv === util.ENV_PRODUCTION});
        Object.defineProperty(this, 'envConfCache', {value: {}});
    }

    getEnvConfig(name) {
        if (this.envConfCache.hasOwnProperty(name)) {
            return this.envConfCache[name];
        }

        if (!this.dir.config) {
            throw new Error(`serverOptions.dir.config undefined`);
        }

        let conf;
        try {
            conf = require(
                `${this.dir.config}${name}${this.isProduction ? '' : `.${this.nodeEnv}`}`
            );
        } catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }

            conf = require(`${this.dir.config}${name}`);
        }

        return this.envConfCache[name] = conf;
    }

    getConfig(name) {
        if (!this.dir.config) {
            throw new Error(`serverOptions.dir.config undefined`);
        }

        return require(`${this.dir.config}${name}`);
    }

    static async getServerContext(options, basePath) {
        return new ServerContext(
            await new ServerOptions().getOptions(options, basePath)
        );
    }

}

module.exports = ServerContext;
