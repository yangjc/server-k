/**
 * YJC <yangjiecong@live.com> @2017-12-12
 */

'use strict';

const path = require('path');

class RouterReset {

    setRouterDir(dir) {
        this.routerDir = dir;
        return this;
    }

    setSubServer(subServerName) {
        this.subServerName = subServerName;
        return this;
    }

    init(subServerContext, routerPath) {
        if (!this.routerDir && !this.subServerName) {
            throw new Error(`should call RouterReset.setRouterDir() or RouterReset.setSubServer()`);
        }
        if (this.subServerName) {
            if (!subServerContext || !subServerContext.hasOwnProperty(this.subServerName)) {
                throw new Error(`unexpected sub-server name: ${this.subServerName}`);
            }
            this.serverContext = subServerContext[this.subServerName];
        }
        if (this.routerDir) {
            this.routerDir = path.resolve(this.routerDir) + path.sep;
        } else {
            this.routerDir = this.serverContext.dir.router;
        }
        this.routerPath = routerPath;
        return this;
    }

}

module.exports = RouterReset;
