"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSubClient = exports.EventPubServer = void 0;
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
const axon = require('pm2-axon');
class EventPubServer {
    constructor(port) {
        this.port = port;
        this.bind();
    }
    bind() {
        this.pub = axon.socket('pub-emitter');
        this.pub_sock = this.pub.bind(this.port);
        this.pub_sock.once('bind', function () {
            console.log("EventPubServer Ready");
        });
    }
    emit(event, message) {
        return this.pub.emit(event, message);
    }
}
exports.EventPubServer = EventPubServer;
class EventSubClient {
    constructor(port) {
        this.port = port;
        this.connect();
    }
    connect() {
        this.sub = axon.socket('sub-emitter');
        this.sub_sock = this.sub.connect(this.port);
        this.sub_sock.once('connect', function () {
            console.log("EventSubClient Ready");
        });
    }
    on(event, cb) {
        return this.sub.on(event, cb);
    }
}
exports.EventSubClient = EventSubClient;
