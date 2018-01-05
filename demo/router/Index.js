/**
 * YJC <yangjiecong@live.com> @2017-08-09
 */

'use strict';

const { Router } = require('@yjc/server-k');

const Example = require('../controller/Example');
const MultiMethods = require('../controller/MultiMethods');
const ComposeActions = require('../controller/ComposeActions');

module.exports = class extends Router {

    main() {
        return this.GET(true, Example, 'main');
    }

    error() {
        // must return this[METHOD]() , this.route() , or array of them
    }

    action() {
        console.log('this function executed just once.');
        return this.GET(Example, 'info');
    }

    'has-args'() {
        // Has not argument, matches: /index/hasArgs
        // Has arguments, matches: /index/hasArgs/...
        return this.GET(true, Example, 'info');
    }

    'no-args'() {
        return this.GET(false, Example, 'info');
    }

    compose() {
        return this.GET(ComposeActions, 'action');
    }

    'call-closed'() {
        return this.GET(ComposeActions, 'm0');
    }

    'multi-method'() {
        return [
            this.GET(MultiMethods, 'formPage'),
            this.POST(MultiMethods, 'post'),
            this.route('head', MultiMethods, 'head')
        ];
    }

    throw() {
        return this.GET(Example, 'throw');
    }

    'get-config'() {
        return this.GET(Example, 'getConfig');
    }

};
