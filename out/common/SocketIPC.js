"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIPCClient = exports.SocketIPCServer = void 0;
const ws_1 = require("ws");
const ws_2 = __importDefault(require("ws"));
// 基于WebSocket的守护进程通信模块, 用于API调用
//TODO PM2应使用rpc技术进行远程调用  而不是ws
class SocketIPCServer {
    constructor(god) {
        this.god = god;
        this.connect();
    }
    connect() {
        const that = this;
        const wss = new ws_1.WebSocketServer({ port: 7888 });
        this._wss = wss;
        wss.on('connection', function connection(ws) {
            that._ws = ws;
            ws.on('error', that.onError);
            ws.on('message', that.onMessage.bind(that));
            ws.send('Deamon Connected Success');
        });
        console.log("Deamon WS Start SUCCESS , port:7888");
    }
    // 解析客户端传递的消息对象
    onMessage(data) {
        try {
            const message = JSON.parse(data.toString());
            if (message.type == "message") {
                console.log('Deamon received message: %s', message.message);
            }
            else if (message.type == "action") {
                this.god.execute(message);
            }
        }
        catch (e) {
            console.log('Deamon received Unknow message: %s', data);
        }
    }
    //
    onError() { console.error; }
    // 发送一个Message给客户端
    sendClient(message) {
        var _a;
        (_a = this._ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(message));
    }
}
exports.SocketIPCServer = SocketIPCServer;
// 客户端用的通信模块
class SocketIPCClient {
    constructor(client) {
        this._retry = 0;
        this._client = client;
    }
    // 异步链接
    connect() {
        const that = this;
        return new Promise((resolve, reject) => {
            const ws = new ws_2.default('ws://localhost:7888');
            this._ws = ws;
            // 三次链接错误重试
            ws.on('error', () => {
                if (that._retry < 3) {
                    console.log("Client connect failed, retry");
                    setTimeout(() => that.connect(), 500);
                }
                else {
                    reject(false);
                }
            });
            // 首次链接
            ws.on('open', that.onOpen.bind(that));
            // 接受消息
            ws.on('message', function message(data) {
                that.onMessage(data);
                resolve(true);
            });
        });
    }
    // 解析客户端传递的消息对象
    onMessage(data) {
        try {
            const message = JSON.parse(data.toString());
            if (message.type == "message") {
                console.log('Deamon received message: %s', message.message);
            }
            else if (message.type == "data") {
                console.log(message.data);
            }
        }
        catch (e) {
            console.log('Client received Unknow message: %s', data);
        }
    }
    // 首次链接时的处理 发送消息,执行prepare
    onOpen() {
        const message = { type: "message", message: "Client Connected Success" };
        this.sendServer(message);
        const action = { type: "action", action: "prepare", args: ['11001'] };
        this.sendServer(action);
        const action_2 = { type: "action", action: "getMonitorInfo" };
        this.sendServer(action_2);
    }
    // 发送一个Message给服务端
    sendServer(message) {
        var _a;
        (_a = this._ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(message));
    }
}
exports.SocketIPCClient = SocketIPCClient;
