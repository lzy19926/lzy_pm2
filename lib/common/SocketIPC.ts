import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
// 守护进程通信模块, 用于API调用
export class SocketIPCServer {
  private _wss?: WebSocketServer
  constructor() { }

  connect() {

    const wss = new WebSocketServer({ port: 7888 });
    this._wss = wss

    wss.on('connection', function connection(ws) {
      ws.on('error', console.error);

      ws.on('message', function message(data) {
        console.log('received: %s', data);
      });

      ws.send('something');
    });

  }
}


export class SocketIPCClient {

  private _ws?: WebSocket

  connect() {
    const ws = new WebSocket('ws://localhost:7888');
    this._ws = ws

    ws.on('error', console.error);

    ws.on('open', function open() {
      ws.send('something');
    });
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });
  }

  sendServer(data: string) {
    this._ws?.send(data)
  }
}