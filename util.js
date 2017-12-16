/**
 * YJC <yangjiecong@live.com> @2017-08-12
 */

'use strict';

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

exports.ENV_PRODUCTION = 'production';
