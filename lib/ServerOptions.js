/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const sUtil = require('../util');
const Router = require('./Router');

const O_REQUIRED = {
    '': [
        'dir',
        'serverName',
        'listen'
    ],
    dir: [
        'base',
        'router'
    ]
};

class ServerOptions {
    constructor(skipCheck) {
        this.skipCheck = skipCheck;
        this.error = [];
        this.subServer = null;
    }

    async resolvePaths(basePath, values, name, isDir, noCheck) {
        if (!values || typeof values !== 'object') {
            return {};
        }

        for (let key in values) {
            if (!values.hasOwnProperty(key)) {
                continue;
            }

            values[key] = path.resolve(basePath, values[key]);

            let dir;
            if (isDir) {
                values[key] += path.sep;
                dir = values[key];
            } else {
                dir = path.dirname(values[key]) + path.sep;
            }

            if (noCheck || this.skipCheck) {
                continue;
            }

            try {
                if (!(await promisify(fs.stat)(dir)).isDirectory()) {
                    this.error.push(`${key}: ${dir}`);
                }
            } catch (e) {
                this.error.push(`${key}: ${dir}`);
            }
        }

        if (this.error.length) {
            throw new Error(`options.${name} access error\n  - ${this.error.join('\n  - ')}`);
        }

        return values;
    }

    resolveAsset(basePath, values) {
        if (!values) {
            return {};
        }

        for (let key in values) {
            if (typeof values[key] === 'object') {
                values[key].alias = path.resolve(basePath, values[key].alias);
            }
        }

        return values;
    }

    async getOptions(options, basePath) {
        if (typeof options === 'string') {
            try {
                if (!basePath) {
                    basePath = path.dirname(options);
                }
                options = require(options);
            } catch (e) {
                throw new Error(`require options module error: ${options}\n${e.message}`);
            }
        }

        if (!options || typeof options !== 'object') {
            throw new Error('options null');
        }

        let properties = [...new Set(Object.keys(options).concat(O_REQUIRED['']))];

        await Promise.all(properties.map(async name => {
            let validatorMethod = `${name}Validator`;
            if (!this[validatorMethod]) {
                return !!name;
            }
            let errMsg = await this[validatorMethod](options[name]);
            if (errMsg) {
                this.error.push(errMsg);
            }
        }));
        if (this.error.length) {
            throw new Error(`options error\n  - ${this.error.join('\n  - ')}`);
        }

        options = Object.assign({}, options);
        if (options.nodeEnv === undefined) {
            options.nodeEnv = process.env.NODE_ENV || '';
        }

        basePath = basePath ? path.resolve(basePath, options.dir.base) : path.resolve(options.dir.base);

        await this.resolvePaths(basePath, options.dir, 'dir', true, false);
        await this.resolvePaths(basePath, options.static, 'static', true, false);
        options.asset = this.resolveAsset(basePath, options.asset);
        options.logFile = await this.resolvePaths(basePath, options.logFile, 'logFile', false, false);

        options.indexFileName && (options.indexFileName = options.indexFileName.toLowerCase());
        options.indexActionName && (options.indexActionName = options.indexActionName.toLowerCase());

        let subServer = options.subServer;
        delete options.subServer;

        sUtil.freeze(options);

        await this.getSubServer(subServer, options);

        return options;
    }

    async getSubServer(subServer, options) {
        if (!subServer || this.subServer !== null) {
            return;
        }

        this.subServer = {};

        for (let name in subServer) {
            if (!subServer.hasOwnProperty(name)) {
                continue;
            }

            try {
                let s = subServer[name];

                if (typeof s === 'function') {
                    s = await s(options);
                }
                if (typeof s === 'string') {
                    s = path.resolve(options.dir.base, s);
                }

                this.subServer[name] = await this.getOptions(s, options.dir.base);

            } catch (e) {
                e.message = `getSubServer(${name})\n${e.message}`;
                throw e;
            }

        }
    }

    static missingProperties(value, name) {
        if (!O_REQUIRED.hasOwnProperty(name)) {
            return null;
        }

        let missing = O_REQUIRED[name].reduce((m, item) => {
            if (!value.hasOwnProperty(item)) {
                m.push(item);
            }
            return m;
        }, []);

        return missing.length ? missing : null;
    }

    dirValidator(value, name) {
        name = name || 'dir';
        if (value && typeof value === 'object') {
            let missing = ServerOptions.missingProperties(value, name);
            if (missing) {
                return `${name}: required: ${missing.join(', ')}`;
            }

            let err = [];
            for (let n in value) {
                let item = value[n];
                if (!item || typeof item !== 'string') {
                    err.push(n);
                }
            }

            return err.length === 0 ? '' : `${name}: should be string: ${err.join(', ')}`;
        }

        return `${name}: should be object`;
    }

    serverNameValidator(value, name) {
        return value && typeof value === 'string' ? '' : `${name || 'serverName'}: should be string`;
    }

    staticValidator(value) {
        let result = this.dirValidator(value, 'static');
        if (result) {
            return result;
        }
        let err = [];
        for (let key in value) {
            if (!Router.isUrlSlice(key)) {
                err.push(key);
            }
        }
        return err.length ? `key of static: should begin and end with "/": ${err.join(', ')}` : '';
    }

    assetValidator(value) {
        if (!value || typeof value !== 'object') {
            return `asset: should be object`;
        }

        let err = [];
        for (let key in value) {
            switch (typeof value[key]) {
                case 'string':
                    if (!Router.isUrlSlice(value[key])) {
                        err.push(`asset.${key}: should begin and end with "/"`);
                    }
                    break;
                case 'object':
                    if (!value[key] || !Router.isUrlSlice(value[key].path) || typeof value[key].alias !== 'string') {
                        err.push(`asset.${key}: should be object{ path: /[.../], alias: module-path }`);
                    }
                    break;
            }
        }

        return err.length ? err.join(', ') : '';
    }

    logFileValidator(value) {
        return this.dirValidator(value, 'logFile');
    }

    indexFileNameValidator(value) {
        return this.serverNameValidator(value, 'indexFileName');
    }

    indexActionNameValidator(value) {
        return this.serverNameValidator(value, 'indexActionName');
    }

    indexStaticFileNameValidator(value) {
        return typeof value === 'string' ? '' : `indexStaticFileName: should be string`;
    }

    subServerValidator(value) {
        return value && typeof value === 'object' ? '' : 'subServer: should be object';
    }

    async listenValidator(value) {
        if (Number.isInteger(value)) {
            return value > 0 ? '' : 'listen: port should be integer';
        }
        if (typeof value === 'string') {
            if (!value) {
                return 'listen: sock path undefined';
            }

            if (this.skipCheck) {
                return '';
            }

            let dir = path.dirname(value);
            let stat;
            try {
                stat = await promisify(fs.stat)(dir);
            } catch (e) {
                return 'listen: sock path error';
            }
            return stat.isDirectory() ? '' : 'listen: sock path error';
        }
        return 'listen: integer|string';
    }
}

module.exports = ServerOptions;
