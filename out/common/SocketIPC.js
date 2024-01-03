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
    constructor() {
        this.connect();
    }
    connect() {
        const wss = new ws_1.WebSocketServer({ port: 7888 });
        this._wss = wss;
        wss.on('connection', function connection(ws) {
            ws.on('error', console.error);
            ws.on('message', function message(data) {
                console.log('Deamon received: %s', data);
            });
            ws.send('Deamon Connected Success');
        });
        console.log("Deamon WS Start SUCCESS , port:7888");
    }
}
exports.SocketIPCServer = SocketIPCServer;
class SocketIPCClient {
    constructor() {
        this._retry = 0;
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
        // 首次链接发送消息
        ws.on('open', function open() {
            ws.send('Client Connected Success');
        });
        // 接受消息
        ws.on('message', function message(data) {
            console.log('Client received: %s', data);
        });
    }
    sendServer(data) {
        var _a;
        (_a = this._ws) === null || _a === void 0 ? void 0 : _a.send(data);
    }
}
exports.SocketIPCClient = SocketIPCClient;
