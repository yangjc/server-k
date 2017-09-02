/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

// will be ignored if duplicated to file router

const {Router} = require('@yjc/server-k');

const Example = require('../../controller/Example');

module.exports = class extends Router {
    constructor(r) {
        super(r);
        this.example = new Example(r);
    }

    main() {
        return this.GET(this.example.info);
    }
};