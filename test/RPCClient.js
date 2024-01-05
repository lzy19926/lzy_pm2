"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const rpc = require('pm2-axon-rpc');
    const axon = require('pm2-axon');
    class RPCClient {
        connect(port) {
            const req = axon.socket('req');
            this._client = new rpc.Client(req);
            req.connect(port);
        }
        // promisify过的rpc.call方法
        call(method, args) {
            const that = this;
            return new Promise((resolve, reject) => {
                that._client.call(method, ...args, function (err, result) {
                    if (err)
                        reject(err);
                    resolve(result);
                });
            });
        }
    }
    const client = new RPCClient();
    client.connect(4000);
    const res = yield client.call("add", [1, 2]);
    console.log(res); // =>3
}))();
