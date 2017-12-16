/**
 * YJC <yangjiecong@live.com> @2017-08-12
 */

'use strict';

const { Router } = require('@yjc/server-k');

const Example = require('../controller/Example');

module.exports = class extends Router {
    constructor(r) {
        super(r);
        this.example = new Example(r);
    }

    main() {
        return this.GET(true, this.example.argsUsage);
    }
};
