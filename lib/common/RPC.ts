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
    server.expose(add)
 *
 *
 *  -----------EXAMPLE-client---------------
 *   const client = new RPCClient()
     client.connect(4000)

     const res = await client.call("add", [1, 2])
     console.log(res);// =>3
 *
*******************************************/


const rpc = require('pm2-axon-rpc')
const axon = require('pm2-axon')


export class RPCServer {

  private _server: any

  listen(port: number) {
    const rep = axon.socket('rep');
    this._server = new rpc.Server(rep);
    rep.bind(port);
    console.log("RPCServer Ready");
  }


  // 将一个函数暴露出去(注意:需要绑定this)
  expose(originFn: Function) {
    this._server.expose(originFn.name, function () {
      const args = Array.from(arguments)
      const cb = args.pop()

      try {
        const res = originFn(...args)
        cb(null, res)
      } catch (err) {
        cb(err)
      }
    })
  }

}


export class RPCClient {

  private _client: any


  connect(port: number) {
    const req = axon.socket('req');
    this._client = new rpc.Client(req);
    req.connect(port);
    console.log("RPCClient Ready");

  }

  // promisify过的rpc.call方法
  call(method: string, args: any[]): Promise<any> {
    const that = this
    return new Promise((resolve, reject) => {
      that._client.call(method, ...args, function (err: Error | null, result: any) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}
