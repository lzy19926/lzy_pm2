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
    unBind() {
        this.pub_sock.close();
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
    once(event, cb) {
        return this.sub_sock.once(event, cb);
    }
    pingServer() {
        const timeout = 5 * 1000;
        return new Promise((resolve, reject) => {
            console.log("[PING PM2] Trying to connect to server");
            this.sub_sock.once('reconnect attempt', function () {
                resolve(false);
            });
            this.sub_sock.once('connect', function () {
                resolve(true);
            });
            setTimeout(() => {
                resolve(false);
            }, timeout);
        });
    }
}
exports.EventSubClient = EventSubClient;
function test() {
    function emit() {
        return __awaiter(this, void 0, void 0, function* () {
            const pubServer = new EventPubServer(4002);
            pubServer.emit("testEvent", "Hello World");
            const subServer = new EventSubClient(4002);
            subServer.on("testEvent", (data) => {
                console.log(data); //=> "Hello World"
            });
        });
    }
    function ping() {
        return __awaiter(this, void 0, void 0, function* () {
            const pubServer = new EventPubServer(4002);
            const subServer = new EventSubClient(4002);
            const res = yield subServer.pingServer();
            console.log(res);
        });
    }
}
