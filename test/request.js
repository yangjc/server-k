/**
 * YJC <yangjiecong@live.com> @2017-08-12
 */

'use strict';

let http = require('http');

http.request({
    hostname: '127.0.0.1',
    port: 3080,
    path: '/multimethod',
    method: 'HEAD'
}, res => {
    console.log(res.statusCode, res.headers);
    res.on('data', thunk => console.log(thunk.toString()));
})
    .on('error', console.error)
    .end();
