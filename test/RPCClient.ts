


(async () => {
  const rpc = require('pm2-axon-rpc')
  const axon = require('pm2-axon')



  class RPCClient {

    private _client: any


    connect(port: number) {
      const req = axon.socket('req');
      this._client = new rpc.Client(req);
      req.connect(port);
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


  const client = new RPCClient()
  client.connect(4000)

  const res = await client.call("add", [1, 2])
  console.log(res);

})()