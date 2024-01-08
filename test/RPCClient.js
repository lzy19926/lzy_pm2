(async () => {
  const rpc = require('pm2-axon-rpc')
  const axon = require('pm2-axon')


  class RPCClient {

    constructor() {
      this._client = null
    }


    connect(port) {
      const req = axon.socket('req');
      this._client = new rpc.Client(req);
      req.connect(port);
    }

    // promisify过的rpc.call方法
    call(method, args) {
      const that = this
      return new Promise((resolve, reject) => {
        that._client.call(method, ...args, function (err, result) {
          if (err) reject(err)
          resolve(result)
        })
      })
    }
  }


  const client = new RPCClient()
  client.connect(4000)

  const res = await client.call("add", [1, 2])
  console.log(res);// =>3

})()