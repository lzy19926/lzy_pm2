// Server
(() => {
  const rpc = require('pm2-axon-rpc')
  const axon = require('pm2-axon')


  class RPCServer {

    constructor() {
      this._server = null
    }

    listen(port) {
      const rep = axon.socket('rep');
      this._server = new rpc.Server(rep);
      rep.bind(port);
    }

    // 将一个函数暴露出去(注意:需要绑定this)
    expose(originFn) {

      function wrappedFn() {
        const args = Array.from(arguments)
        const callback = args.pop()

        try {
          const res = originFn(...args)
          callback(null, res)
        } catch (err) {
          callback(err)
        }
      }

      this._server.expose(originFn.name, wrappedFn)
    }

  }




  const server = new RPCServer()
  server.listen(4000)


  function add(a, b) {
    return a + b
  }
  server.expose(add)
})()
