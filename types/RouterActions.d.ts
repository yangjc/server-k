/**
 * YJC <yangjiecong@live.com> @2017-10-16
 */

import { RouterAction } from './RouterAction';

export declare class RouterActions {
    constructor(action: RouterAction);
    constructor(actions: RouterAction[]);

    length: number;
    error: null | string[];

    /* http.METHODS */
    ACL         ?: RouterAction;
    BIND        ?: RouterAction;
    CHECKOUT    ?: RouterAction;
    CONNECT     ?: RouterAction;
    COPY        ?: RouterAction;
    DELETE      ?: RouterAction;
    GET         ?: RouterAction;
    HEAD        ?: RouterAction;
    LINK        ?: RouterAction;
    LOCK        ?: RouterAction;
    'M-SEARCH'  ?: RouterAction;
    MERGE       ?: RouterAction;
    MKACTIVITY  ?: RouterAction;
    MKCALENDAR  ?: RouterAction;
    MKCOL       ?: RouterAction;
    MOVE        ?: RouterAction;
    NOTIFY      ?: RouterAction;
    OPTIONS     ?: RouterAction;
    PATCH       ?: RouterAction;
    POST        ?: RouterAction;
    PROPFIND    ?: RouterAction;
    PROPPATCH   ?: RouterAction;
    PURGE       ?: RouterAction;
    PUT         ?: RouterAction;
    REBIND      ?: RouterAction;
    REPORT      ?: RouterAction;
    SEARCH      ?: RouterAction;
    SUBSCRIBE   ?: RouterAction;
    TRACE       ?: RouterAction;
    UNBIND      ?: RouterAction;
    UNLINK      ?: RouterAction;
    UNLOCK      ?: RouterAction;
    UNSUBSCRIBE ?: RouterAction;
    /* end http.METHODS */
    
}
