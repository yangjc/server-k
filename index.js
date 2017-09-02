/**
 * YJC <yangjiecong@live.com> @2017-08-10
 */

'use strict';

const Server = require('./lib/Server');

exports.Router = require('./lib/Router');
exports.Controller = require('./lib/Controller');

exports.util = require('./util');

exports.startServer = function (options, basePath) {
    return new Server().start(options, basePath);
};

exports.testOptions = function (options, basePath) {
    return Server.testOptions(options, basePath);
};

module.parent === null && require('./bin/startServer')();
