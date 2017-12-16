/**
 * YJC <yangjiecong@live.com> @2017-11-09
 */

import { Context as TContext } from './Context';
import { MiddlewareItem as TMiddlewareItem } from './MiddlewareItem';
import { ResponseData as TResponseData } from './ResponseData';
import { RouterAction as TRouterAction } from './RouterAction';
import { RouterActions as TRouterActions } from './RouterActions';
import { RouterContext as TRouterContext } from './RouterContext';
import { ServerContext as TServerContext } from './ServerContext';
import {
    InputServerOptions as TInputServerOptions,
    FrozenServerOptions as TFrozenServerOptions
} from './ServerOptions';

export declare namespace ServerKTypes {
    type Context = TContext;
    type MiddlewareItem = TMiddlewareItem;
    type ResponseData = TResponseData;
    type RouterAction = TRouterAction;
    type RouterActions = TRouterActions;
    type RouterContext = TRouterContext;
    type ServerContext = TServerContext;
    type InputServerOptions = TInputServerOptions;
    type FrozenServerOptions = TFrozenServerOptions;
}
