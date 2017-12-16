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
        // type: path or {path: , alias: }
    },
    logFile: {
        // type: file
        runtimeError: ''
    },
    indexFileName: 'index',
    indexActionName: 'main',
    indexStaticFileName: 'index.html',
    subServer: null, // object
    listen: null // string | int
};
