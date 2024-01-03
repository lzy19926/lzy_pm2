"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIPCClient = exports.SocketIPCServer = void 0;
const ws_1 = require("ws");
const ws_2 = __importDefault(require("ws"));
// 守护进程通信模块, 用于API调用
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
            ws.on('error', console.error);
            // 尝试将所有消息解析为action
            ws.on('message', function message(data) {
                try {
                    const action = JSON.parse(data.toString());
                    if (action.action) {
                        that.god.execute(action);
                    }
                }
                catch (e) {
                    console.log('Deamon received: %s', data);
                }
            });
            ws.send('Deamon Connected Success');
        });
        console.log("Deamon WS Start SUCCESS , port:7888");
    }
}
exports.SocketIPCServer = SocketIPCServer;
// 客户端用的通信模块
class SocketIPCClient {
    constructor(client) {
        this._retry = 0;
        this._client = client;
    }
    connect() {
        const that = this;
        const ws = new ws_2.default('ws://localhost:7888');
        this._ws = ws;
        // 三次链接错误重试
        ws.on('error', () => {
            if (that._retry < 3) {
                console.log("Client connect failed, retry");
                setTimeout(() => that.connect(), 500);
            }
        });
        // 首次链接发送消息,执行prepare
        ws.on('open', function open() {
            const message = { type: "message", message: "Client Connected Success" };
            that.sendServer(message);
            const action = { type: "action", action: "prepare", args: ['11001'] };
            that.sendServer(action);
        });
        // 接受消息
        ws.on('message', function message(data) {
            console.log('Client received: %s', data);
        });
    }
    // 发送一个Message给服务端
    sendServer(message) {
        var _a;
        (_a = this._ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(message));
    }
}
exports.SocketIPCClient = SocketIPCClient;
