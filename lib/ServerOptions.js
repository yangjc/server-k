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
        this.basePath = '';
        this.error = [];
    }

    async resolvePaths(values, name, isDir, noCheck) {
        if (!values || typeof values !== 'object') {
            return {};
        }

        for (let key in values) {
            if (!values.hasOwnProperty(key)) {
                continue;
            }

            if (values[key][0] !== '/') {
                values[key] = path.resolve(this.basePath, values[key]);
            }

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

        options = Object.assign({nodeEnv: process.env.NODE_ENV}, options);

        this.basePath = basePath
            ? path.resolve(basePath, options.dir.base)
            : path.resolve(options.dir.base);

        await this.resolvePaths(options.dir, 'dir', true, false);
        await this.resolvePaths(options.static, 'static', true, false);
        options.asset = await this.resolvePaths(options.asset, 'asset', false, true);
        options.logFile = await this.resolvePaths(options.logFile, 'logFile', false, false);

        options.indexFileName && (options.indexFileName = options.indexFileName.toLowerCase());
        options.indexActionName && (options.indexActionName = options.indexActionName.toLowerCase());

        return sUtil.freeze(options);
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
        return this.dirValidator(value, 'asset');
    }

    logFileValidator(value) {
        return this.dirValidator(value, 'logFile');
    }

    staticPathValidator(value) {
        return Router.isUrlSlice(value)
            ? ''
            : 'staticPath: should begin and end with "/"';
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
