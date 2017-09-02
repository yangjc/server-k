/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

let util = require('@yjc/server-k/util');

module.exports = util.getServerConfig({
    serverName: 'demo',
    dir: {
        base: '.',
        router: 'router',
        template: 'template',
        config: 'config',
        // frontend: 'frontend'
    },
    staticPath: '/',
    listen: 3080
}, {
    dev: {
        static: {
            '/public/': 'static/public',
            '/1/2/3/4/5/6/': 'static/source',
            '/': 'static/public',
            '/a/2/3/': 'static'
        },
        asset: {
            js: '/source/js/dev',
            css: '/source/css'
        },
        staticPath: '/source/',
        logFile: {
            runtimeError: 'error.log'
        }
    },
    [util.ENV_PRODUCTION]: {
        static: {
            '/public/': 'static/public',
        },
        asset: {
            js: 'frontend/assets.js.json',
            css: 'frontend/assets.css.json'
        },
        staticPath: '/public/',
        logFile: {
            runtimeError: 'error.log'
        }
    }
});
