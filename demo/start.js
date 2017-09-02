/**
 * YJC <yangjiecong@live.com> @2017-08-12
 */

'use strict';

// or run `server-k start`

module.parent === null && (function () {
    require('@yjc/server-k').startServer(`${__dirname}/server-k.config.js`).catch(console.error);
})();
