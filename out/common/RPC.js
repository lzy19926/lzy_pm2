"use strict";
/******************************************
 * 客户端与服务端的RPC通信组件
 *  @author lzy19926
 *
 *
 * -----------EXAMPLE-server---------------
 *
 *  const server = new RPCServer()
    server.listen(4000)

    function add(a: number, b: number) {
      return a + b
    }
    server.expose("newAdd",add)
 *
 *
 *  -----------EXAMPLE-client---------------
 *   const client = new RPCClient()
     client.connect(4000)

     const res = await client.call("newAdd", [1, 2])
     console.log(res);// =>3
 *
*******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCClient = exports.RPCServer = void 0;
const rpc = require('pm2-axon-rpc');
const axon = require('pm2-axon');
class RPCServer {
    listen(port) {
        const rep = axon.socket('rep');
        this._server = new rpc.Server(rep);
        rep.bind(port);
        console.log("RPCServer Ready");
    }
    // 将一个函数暴露出去,并重命名(注意:需要绑定this后函数名会改变 add => bound add)
    expose(name, originFn) {
        this._server.expose(name, function () {
            const args = Array.from(arguments);
            const cb = args.pop();
            try {
                const res = originFn(...args);
                cb(null, res);
            }
            catch (err) {
                cb(err);
            }
        });
    }
}
exports.RPCServer = RPCServer;
class RPCClient {
    connect(port) {
        const req = axon.socket('req');
        this._client = new rpc.Client(req);
        req.connect(port);
        console.log("RPCClient Ready");
    }
    // promisify过的rpc.call方法
    call(method, args = []) {
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
exports.RPCClient = RPCClient;
