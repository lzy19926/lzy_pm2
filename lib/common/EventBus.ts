/******************************************
 * 使用AXON实现的Pub-Sub工具
 * 用于God给子进程发派任务
 *  @author lzy19926
 *
 *
 * -----------EXAMPLE-Server---------------
 *
 *  const pubServer = new EventPubServer(4001)

    pubServer.emit("testEvent", "Hello World")

 *  -----------EXAMPLE-Client---------------
 *   const subServer = new EventSubClient(4001)

 *   subServer.on("testEvent", (data) => {
      console.log(data); //=> "Hello World"
     })

*******************************************/
const axon = require('pm2-axon')


export class EventPubServer {
  constructor(private port: number) {
    this.bind()
  }

  pub: any
  pub_sock: any

  bind() {
    this.pub = axon.socket('pub-emitter');
    this.pub_sock = this.pub.bind(this.port);

    this.pub_sock.once('bind', function () {
      console.log("EventPubServer Ready");
    });
  }

  emit(event: string, message: any) {
    return this.pub.emit(event, message);
  }
}

export class EventSubClient {
  constructor(private port: number) {
    this.connect()
  }

  sub: any
  sub_sock: any

  connect() {
    this.sub = axon.socket('sub-emitter');
    this.sub_sock = this.sub.connect(this.port);

    this.sub_sock.once('connect', function () {
      console.log("EventSubClient Ready");
    });
  }

  on(event: string, cb: (data: any) => void) {
    return this.sub.on(event, cb);
  }
}