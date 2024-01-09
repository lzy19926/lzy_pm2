//@ts-nocheck
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import God from '../Daemon/God';
import ProgressManagerClient from '../Client/Client';

// 基于WebSocket的守护进程通信模块, 用于API调用
export class SocketIPCServer {
  private _wss?: WebSocketServer
  private _ws?: WebSocket
  private god: God

  constructor(god: God) {
    this.god = god
    this.connect()
  }

  connect() {
    const that = this
    const wss = new WebSocketServer({ port: 7888 });
    this._wss = wss

    wss.on('connection', function connection(ws) {

      that._ws = ws

      ws.on('error', that.onError);

      ws.on('message', that.onMessage.bind(that));

      ws.send('Deamon Connected Success');
    });

    console.log("Deamon WS Start SUCCESS , port:7888")

  }

  // 解析客户端传递的消息对象
  onMessage(data: WebSocket.RawData) {
    try {
      const message: IPCMessage = JSON.parse(data.toString())
      if (message.type == "message") {
        console.log('Deamon received message: %s', message.message);
      }
      else if (message.type == "action") {
        this.god.execute()
      }
    } catch (e) {
      console.log('Deamon received Unknow message: %s', data);
    }
  }

  //
  onError() { console.error }

  // 发送一个Message给客户端
  sendClient(message: IPCMessage) {
    this._ws?.send(JSON.stringify(message))
  }
}

// 客户端用的通信模块
export class SocketIPCClient {

  private _ws?: WebSocket
  private _retry: number = 0
  private _client: ProgressManagerClient

  constructor(client: ProgressManagerClient) {
    this._client = client
  }

  // 异步链接
  connect(): Promise<boolean> {
    const that = this
    return new Promise((resolve, reject) => {
      const ws = new WebSocket('ws://localhost:7888');
      this._ws = ws

      // 三次链接错误重试
      ws.on('error', () => {
        if (that._retry < 3) {
          console.log("Client connect failed, retry");
          setTimeout(() => that.connect(), 500)
        } else {
          reject(false)
        }
      });

      // 首次链接
      ws.on('open', that.onOpen.bind(that));

      // 接受消息
      ws.on('message', function message(data) {
        that.onMessage(data)
        resolve(true)
      });
    })

  }

  // 解析客户端传递的消息对象
  onMessage(data: WebSocket.RawData) {
    try {
      const message: IPCMessage = JSON.parse(data.toString())
      if (message.type == "message") {
        console.log('Deamon received message: %s', message.message);
      }
      else if (message.type == "data") {
        console.log(message.data);
      }
    } catch (e) {
      console.log('Client received Unknow message: %s', data);
    }
  }

  // 首次链接时的处理 发送消息,执行prepare
  onOpen() {
    const message: IPCMessage = { type: "message", message: "Client Connected Success" }
    this.sendServer(message)
    const action: IPCMessage = { type: "action", action: "prepare", args: ['11001'] }
    this.sendServer(action)
    const action_2: IPCMessage = { type: "action", action: "getMonitorInfo" }
    this.sendServer(action_2)
  }

  // 发送一个Message给服务端
  sendServer(message: IPCMessage) {
    this._ws?.send(JSON.stringify(message))
  }
}

// 用于Server与Client传递的消息对象
export interface IPCMessage {
  type: "message" | "action" | "data"
  message?: string
  action?: string
  data?: any
  args?: any[]
}