/**
 * YJC <yangjiecong@live.com> @2017-08-12
 */

'use strict';

const ENV_PRODUCTION = 'production';

exports.ENV_PRODUCTION = ENV_PRODUCTION;

function extend(source, ext) {
    if (!source || typeof source !== 'object') {
        source = {};
    }
    for (let i in ext) {
        let item = ext[i];
        if (item && typeof item === 'object') {
            source[i] = extend(source[i], item);
        } else {
            source[i] = item;
        }
    }
    return source;
}

function freeze(object) {
    if (typeof object === 'object' && object !== null) {
        for (let i in object) {
            freeze(object[i]);
        }
        Object.freeze(object);
    }
    return object;
}

exports.extend = extend;

exports.freeze = freeze;

exports.getServerConfig = function (defaultConfig, envConfig) {
    if (envConfig && typeof envConfig === 'object') {
        let nodeEnv = defaultConfig.nodeEnv || process.env.NODE_ENV;
        if (envConfig.hasOwnProperty(nodeEnv)) {
            return extend(defaultConfig, envConfig[nodeEnv]);
        }
    }

    return defaultConfig;
};

exports.getGetConfig = function (...configDirPaths) {
    const configDir = require('path').resolve.apply(null, configDirPaths)
        + (/\/$/.test(configDirPaths[configDirPaths.length - 1]) ? '/' : '');

    configDirPaths = null;

    let cache = {};

    return (name) => {
        if (cache.hasOwnProperty(name)) {
            return cache[name];
        }

        let conf;
        try {
            conf = require(
                `${configDir}${name}${process.env.NODE_ENV === ENV_PRODUCTION ? '' : `.${process.env.NODE_ENV}`}`
            );
        } catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }

            conf = require(`${configDir}${name}`);
        }

        return cache[name] = conf;
    }
};
