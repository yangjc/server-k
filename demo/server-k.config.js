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
    listen: 3080
}, {
    dev: {
        static: {
            '/public/': 'static/public',
            '/source/': 'static/source',
            '/1/2/3/4/5/6/': 'static/public',
            '/': 'static/public',
            '/a/2/3/': 'static'
        },
        asset: {
            js: '/source/js/',
            css: '/source/css/'
        },
        logFile: {
            runtimeError: 'error.log'
        }
    },
    [util.ENV_PRODUCTION]: {
        static: {
            '/public/': 'static/public',
        },
        asset: {
            js: {
                path: '/public/js/',
                alias: 'frontend/assets.js.json'
            },
            css: {
                path: '/public/css/',
                alias: 'frontend/assets.css.json'
            }
        },
        logFile: {
            runtimeError: 'error.log'
        }
    }
});
