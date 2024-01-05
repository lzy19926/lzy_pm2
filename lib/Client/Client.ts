import path from 'path'
import fs from 'fs'
import { RPCClient } from '../common/RPC'
import { GlobalEnv } from './Utils'
import LogManager from './LogManager'
// PM2调用客户端
export default class ProgressManagerClient {

  private RPCClient = new RPCClient()
  private envManager = new GlobalEnv()
  private logManager = new LogManager()

  constructor() { }

  // 执行远程命令,通过RPC直接调用Daemon方法
  executeRemote(command: string) { }

  // 启动一个PM2客户端作为守护进程
  async launchDaemon() {
    if (this._checkDaemon()) return

    const daemonPID = this._createDaemon().pid

    // 修改全局env
    this.envManager.setEnv("LZY_PM2_RUNNING", "true")
    this.envManager.setEnv("LZY_PM2_PID", daemonPID)


    console.log(`Daemon Running PID:${daemonPID}`);
  }

  // 杀死守护进程
  killDaemon() {
    const pid = this.envManager.getEnv("LZY_PM2_PID")
    try {
      process.kill(pid, 'SIGTERM');
      this.envManager.setEnv("LZY_PM2_RUNNING", "false")
      this.envManager.setEnv("LZY_PM2_PID", "")

      console.log(`Daemon killed SUCCESS PID:${pid}`);
    } catch (e) {
      console.error(`Daemon killed FAILED PID:${pid}`, e);
    }
  }

  // 创建守护进程
  private _createDaemon() {
    const DaemonJS = path.resolve(__dirname, "../Daemon/Daemon.js")

    let daemon_process = require('child_process').spawn("node", [DaemonJS], {
      detached: true,
      cwd: process.cwd(),
      windowsHide: true,
      env: Object.assign({}, process.env),
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    });

    //TODO 守护进程的输出到专门的日志文件
    // 处理子进程的输出信息
    daemon_process.stdout.on('data', (data: any) => {
      console.log(data.toString());
    });

    // 处理子进程的错误信息
    // daemon_process.stderr.on('data', (err: any) => {
    //   console.error(err.toString());
    // });

    // 处理子进程的接受数据
    // daemon_process.on('message', (msg: any) => {
    //   console.log(`Received message from other process : ${msg}`);
    // });

    return daemon_process
  }

  // 检查是否已经运行Daemon
  private _checkDaemon(): boolean {
    const isPM2Running = this.envManager.getEnv("LZY_PM2_RUNNING")
    const pid = this.envManager.getEnv("LZY_PM2_PID")

    if (isPM2Running == "true") {
      console.log(`LZY_PM2 Already Running: PID:${pid},WS:7888`);
      return true
    } else {
      return false
    }
  }

  //TODO pingDaemon() { }

  //TODO getAllProcess() { }

  //TODO getProcessByNameOrId() { }

  //TODO startWatch() { }

  //TODO boardCase() { }


}