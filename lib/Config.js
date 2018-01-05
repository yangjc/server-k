/**
 * YJC <yangjiecong@live.com> @2017-11-08
 */

'use strict';

const ENV_PRODUCTION = require('../util').ENV_PRODUCTION;

class Config {

    constructor(...configDirPaths) {
        if (configDirPaths[0] !== undefined) {
            this.setConfigDir(...configDirPaths);
        }
        this.cache = {};
    }

    setConfigDir(...configDirPaths) {
        this.configDir = require('path').resolve(...configDirPaths)
            // 直接拼接，以保留添加前缀的能力。
            // 如果传入路径为目录，末尾的“/”不可省略。
            + (/\/$/.test(configDirPaths[configDirPaths.length - 1]) ? '/' : '');
    }

    get(name) {
        if (this.cache.hasOwnProperty(name)) {
            return this.cache[name];
        }

        let conf;
        try {
            conf = require(
                `${this.configDir}${name}${process.env.NODE_ENV === ENV_PRODUCTION ? '' : `.${process.env.NODE_ENV}`}`
            );
        } catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }

            conf = require(`${this.configDir}${name}`);
        }

        return this.cache[name] = conf;
    }

    getItem(nameOrObject, itemName) {
        const config = typeof nameOrObject === 'string' ? this.get(nameOrObject) : nameOrObject;

        if (!config || typeof config !== 'object') {
            return null;
        }

        if (itemName) {
            return config.hasOwnProperty(itemName) ? config[itemName] : null;
        }

        for (let key in config) {
            if (config.hasOwnProperty(key) && config[key] && config[key].isDefault === true) {
                return config[key];
            }
        }
        return null;
    }

}

Object.defineProperty(Config, 'ENV_PRODUCTION', {
    enumerable: true,
    value: ENV_PRODUCTION
});

module.exports = Config;
