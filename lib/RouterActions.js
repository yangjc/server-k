/**
 * YJC <yangjiecong@live.com> @2017-09-06
 */

'use strict';

let RouterAction;

class RouterActions {

    constructor(actions) {
        let length = 0;
        let error = [];

        RouterAction = RouterAction || require('./RouterAction');

        if (actions instanceof RouterAction) {
            this[actions.method] = actions;
            length = 1;

        } else if (Array.isArray(actions)) {
            for (let i = 0; i < actions.length; i++) {
                let a = actions[i];

                if (!(a instanceof RouterAction)) {
                    error.push(`[${i}] should be Router.route() or Router[METHOD]()`);
                    continue;
                }

                if (this.hasOwnProperty(a.method)) {
                    error.push(`[${i}] duplicate http method: ${a.method}`);
                    continue;
                }

                this[a.method] = a;
                length++;
            }

        } else {
            error.push(`action method should return Router.route(), Router[METHOD]() or array`);
        }

        Object.defineProperty(this, 'length', {value: length, writable: true});
        Object.defineProperty(this, 'error', {value: error.length ? error : null, writable: true});

    }

}

module.exports = RouterActions;
