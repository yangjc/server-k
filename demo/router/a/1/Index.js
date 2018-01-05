/**
 * YJC <yangjiecong@live.com> @2017-08-12
 */

'use strict';

const { Router } = require('@yjc/server-k');

const Example = require('../../../controller/Example');

module.exports = class extends Router {

    main() {
        return this.GET(Example, 'info');
    }

};
