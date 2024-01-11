/******************************************
 * LzyPM2客户端入口
 *  @author lzy19926
*******************************************/

import path from 'path'
import fs from "node:fs"
import { RPCClient } from '../common/RPC'
import { GlobalEnv } from '../common/Utils'
import { spawn } from 'node:child_process'
import { EventSubClient } from '../common/PubSub'
//
export interface ClientConfig {
  showDaemonLog?: boolean
}

// PM2调用客户端
export default class ProgressManagerClient {

  public RPCClient = new RPCClient(4000)
  public subClient = new EventSubClient(4001)
  private envManager = new GlobalEnv()
  private config: ClientConfig = {}

  constructor(config?: ClientConfig) {
    this._parseConfig(config)
  }

  // 执行远程命令,通过RPC直接调用Daemon方法
  async executeRemote(command: string, args?: any[]) {
    return this.RPCClient.call(command, args)
  }

  // 启动守护进程
  async launchDaemon() {
    if (await this.pingDaemon()) return

    const daemon = this._spawnDaemon()

    this.envManager.setEnv("LZY_PM2_RUNNING", "true")
    this.envManager.setEnv("LZY_PM2_PID", daemon.pid)

    console.log(`Daemon Running PID:${daemon.pid}`);
  }

  // 杀死守护进程(由进程内部关停)
  async killDaemon() {
    if (!await this.pingDaemon()) {
      return console.log(`Daemon Already Killed`);
    }

    this.executeRemote('killMe');

    this.envManager.setEnv("LZY_PM2_RUNNING", "false")
    this.envManager.setEnv("LZY_PM2_PID", "")

    console.log(`Daemon killed SUCCESS`);
  }

  // ping守护进程(retry * 3)
  async pingDaemon(retry: number = 3) {
    let finalRes = false

    while (!finalRes && retry-- > 0) {
      finalRes = await this.subClient.pingServer()
    }

    finalRes
      ? console.log("Daemon Alive")
      : console.log("Ping Daemon Failed")

    return finalRes
  }

  // 创建守护进程
  private _spawnDaemon() {
    const DAEMON_LOG_FILE_PATH = path.resolve(__dirname, "../../cache/0_logFile.json")
    const outStream = fs.openSync(DAEMON_LOG_FILE_PATH, "a")
    const DaemonJS = path.resolve(__dirname, "../Daemon/Daemon.js")

    let daemon_process = spawn("node", [DaemonJS], {
      detached: true,
      cwd: process.cwd(),
      windowsHide: true,
      env: Object.assign({}, process.env),
      // 守护进程的输出到专门的日志文件
      // 只有当父进程未链接子进程IO时, 子进程才能单独保持
      stdio: ['ignore', outStream, outStream, 'ignore'],
    });

    daemon_process.unref();

    return daemon_process
  }

  // 解析config字段
  private _parseConfig(config?: ClientConfig) {
    const defaultConfig: ClientConfig = {}

    if (typeof config !== "undefined") {
      defaultConfig.showDaemonLog = config.showDaemonLog || false
    }

    this.config = defaultConfig
    return this.config
  }

  //TODO getAllProcess() { }

  //TODO getProcessByNameOrId() { }

  //TODO startWatch() { }

  //TODO boardCase() { }
}
