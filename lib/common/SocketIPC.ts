import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
// 守护进程通信模块, 用于API调用
export class SocketIPCServer {
  private _wss?: WebSocketServer
  constructor() {
    this.connect()
  }

  connect() {

    const wss = new WebSocketServer({ port: 7888 });
    this._wss = wss

    wss.on('connection', function connection(ws) {
      ws.on('error', console.error);

      ws.on('message', function message(data) {
        console.log('Deamon received: %s', data);
      });

      ws.send('Deamon Connected Success');
    });

    console.log("Deamon WS Start SUCCESS , port:7888")

  }
}


export class SocketIPCClient {

  private _ws?: WebSocket
  private _retry: number = 0

  connect() {
    const that = this
    const ws = new WebSocket('ws://localhost:7888');
    this._ws = ws

    // 三次链接错误重试
    ws.on('error', () => {
      if (that._retry < 3) {
        console.log("Client connect failed, retry");
        setTimeout(() => that.connect(), 500)
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

  sendServer(data: string) {
    this._ws?.send(data)
  }
}