/**
 * YJC <yangjiecong@live.com> @2017-08-12
 */

'use strict';

const fs = require('fs');
const promisify = require('util').promisify;

const Mustache = require('mustache');

const MustacheData = require('./MustacheData');

class Template {
    constructor(serverContext) {
        this.serverContext = serverContext;
        this.templateDir = serverContext.dir.template;
        this.templateType = 'mustache';
        this.templateCache = {};

        this.MustacheData = MustacheData(this);
    }

    async render(data, templateName) {
        templateName = templateName || 'index';
        let template = this.templateCache.hasOwnProperty(templateName) ? this.templateCache[templateName] : null;
        if (template === null) {
            try {
                template = await promisify(fs.readFile)(
                    `${this.templateDir}${templateName}.${this.templateType}`,
                    'utf8'
                );
            } catch (e) {
                template = `read template file error: ${templateName}`;
            }
            this.templateCache[templateName] = template;
        }

        return Mustache.render(
            template,
            new this.MustacheData(data)
        );
    }

    staticPath(path) {
        let i = path.indexOf('/');
        let type = path.substr(0, i);
        let name = path.substr(i + 1);

        if (!this.serverContext.asset.hasOwnProperty(type)) {
            return path;
        }

        let asset = this.serverContext.asset[type];
        let alias;

        switch (type) {
            case 'css':
            case 'js':
                if (typeof asset === 'string') {
                    return `${asset}${name}.${type}`;
                }
                alias = require(asset.alias);
                break;
            default:
                return path;
        }

        if (alias.hasOwnProperty(name)) {
            return `${asset.path}${alias[name]}`;
        }

        return path;
    }

}

module.exports = Template;
