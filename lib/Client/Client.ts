/******************************************
 * LzyPM2客户端入口
 *  @author lzy19926
*******************************************/

import path from 'path'
import { RPCClient } from '../common/RPC'
import { GlobalEnv } from './Utils'
import LogManager from './LogManager'
import { spawn } from 'node:child_process'
import { showTerminalList } from '../common/terminal-table'
// PM2调用客户端
export default class ProgressManagerClient {

  public RPCClient = new RPCClient()
  private envManager = new GlobalEnv()
  private logManager = new LogManager()

  constructor() {
    this.RPCClient.connect(4000)
  }

  // 执行远程命令,通过RPC直接调用Daemon方法
  async executeRemote(command: string, args?: any[]) {
    return this.RPCClient.call(command, args)
  }

  // 启动守护进程
  async launchDaemon() {
    if (this._checkDaemon()) return

    const daemon = this._spawnDaemon()

    // 修改全局env
    this.envManager.setEnv("LZY_PM2_RUNNING", "true")
    this.envManager.setEnv("LZY_PM2_PID", daemon.pid)

    console.log(`Daemon Running PID:${daemon.pid}`);

    const list = await this.executeRemote("getMonitorData")
    showTerminalList(list)
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
  private _spawnDaemon() {
    const DaemonJS = path.resolve(__dirname, "../Daemon/Daemon.js")

    let daemon_process = spawn("node", [DaemonJS], {
      detached: true,
      cwd: process.cwd(),
      windowsHide: true,
      env: Object.assign({}, process.env),
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    });

    //TODO 守护进程的输出到专门的日志文件
    // 处理子进程的输出信息
    daemon_process.stdout?.on('data', (data: any) => {
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
      console.log(`LZY_PM2 Already Running: PID:${pid}`);
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