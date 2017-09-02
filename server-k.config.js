/**
 * YJC <yangjiecong@live.com> @2017-08-09
 * default config file
 */

'use strict';

module.exports = {
    serverName: '',
    dir: {
        base: '.', // required
        router: '', // required
        template: ''
        // frontend:
        // controller:
        // model:
        // middleware:
        // config:
    },
    static: {
        // /path/: dir
    },
    asset: {
        // type: file
    },
    logFile: {
        // type: file
        runtimeError: ''
    },
    staticPath: '/',
    indexFileName: 'index',
    indexActionName: 'main',
    indexStaticFileName: 'index.html',
    listen: null // string | int
};
