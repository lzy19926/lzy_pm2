"use strict";
// Server
const rpc = require('axon-rpc');
const axon = require('axon');
const rep = axon.socket('rep');
var server = new rpc.Server(rep);
rep.bind(4000);
// 服务端暴露一组函数
server.expose({
    add: function (a, b, fn) {
        fn(null, a + b);
    },
    sub: function (a, b, fn) {
        fn(null, a - b);
    }
});
