import path from 'path'
import God from './God'
import ConfigManager from './ConfigManager'
import { SocketIPCServer } from '../common/SocketIPC'
// PM2单独启动的守护进程
export default class ProgressManagerClient {

  public configManager = new ConfigManager() // 配置中心
  public IPCServer = new SocketIPCServer() // ws通信模块
  private god = new God() // 核心操作模块

  constructor() {
    this.launchDaemon()
  }


  // 启动一个PM2客户端作为守护进程
  launchDaemon() {
    const isPM2Running = this.god.getEnv("LZY_PM2_RUNNING")
    const pid = this.god.getEnv("LZY_PM2_PID")
    if (isPM2Running == "true") return console.log(`LZY_PM2 Already Running: PID:${pid}`);


    const scriptPath = path.resolve(__filename)

    var deamon_process = require('child_process').spawn("node", [scriptPath], {
      detached: true,
      cwd: process.cwd(),
      windowsHide: true,
      env: Object.assign({}, process.env),
      stdio: ['ipc', 'pipe', 'pipe'],// 监听IPC中的stdin
    });

    // 处理子进程的输出信息
    deamon_process.stdout.on('data', (data: any) => {
      console.log(data.toString());
    });

    // 处理子进程的错误信息
    deamon_process.stderr.on('data', (err: any) => {
      console.error(err.toString());
    });

    // 处理子进程的接受数据
    deamon_process.on('message', (msg: any) => {
      console.log(`Received message from other process : ${msg}`);
    });

    // 修改全局env
    this.god.setEnv("LZY_PM2_RUNNING", "true")
    this.god.setEnv("LZY_PM2_PID", deamon_process.pid)
    //
    console.log(`Deamon Running PID:${deamon_process.pid}`);
  }

  killDaemon() {
    this.god.setEnv("LZY_PM2_RUNNING", "false")
  }

  pingDaemon() { }

  getAllProcess() { }

  getProcessByNameOrId() { }

  startWatch() { }

  boardCase() { }
}
