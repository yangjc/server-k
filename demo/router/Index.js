/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

const {Router} = require('@yjc/server-k');

const Example = require('../controller/Example');
const MultiMethod = require('../controller/MultiMethod');
const MultiMiddleware = require('../controller/MultiMiddleware');

/*
 * class extends Router:
 *   new Controller;
 *   define action;
 *   return middleware;
 *
 * nothing more
 */

module.exports = class extends Router {
    constructor(r) {
        super(r);
        this.example = new Example(r);
        this.cMultiMethod = new MultiMethod(r);
        this.cMultiMiddleware = new MultiMiddleware(r);
    }

    main() {
        // `this.example.main` will be replaced by `this.example.main.bind(this.example)` when initializing
        return this.GET(true, this.example.main);
    }

    'favicon.ico'() {
        // pass middleware directly if don't need to use controller context
        return this.GET(ctx => ctx.status = 204);
    }

    error() {
        // must return this[METHOD]() , this.route() , or array of them
    }

    action() {
        console.log('this function executed just once.');
        return this.GET(this.example.info);
    }

    hasArgs() {
        // Has not argument, matches: /index/hasArgs
        // Has arguments, matches: /index/hasArgs/...
        return this.GET(true, this.example.info);
    }

    noArgs() {
        return this.GET(false, this.example.info);
    }

    multiMiddleware() {
        return this.GET(
            this.cMultiMiddleware.m0,
            this.cMultiMiddleware.m1,
            this.cMultiMiddleware.m2
        );
    }

    multiMethod() {
        return [
            this.GET(this.cMultiMethod.formPage),
            this.POST(this.cMultiMethod.post),
            this.route('head', this.cMultiMethod.head)
        ];
    }

    throw() {
        return this.GET(this.example.throw);
    }

    getConfig() {
        return this.GET(this.example.getConfig);
    }

};
