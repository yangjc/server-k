/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

const { Router } = require('@yjc/server-k');

const Example = require('../controller/Example');

module.exports = class extends Router {

    // change case to avoid name conflict
    CONSTRUCTOR() {
        return this.GET(Example, 'hello');
    }

};
