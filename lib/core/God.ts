
import path from 'path'
import ConfigManager from '../core/ConfigManager'
import { SocketIPCServer } from '../common/SocketIPC'
import type { AppConfig } from "./ConfigManager"
import type { IPCMessage } from '../common/SocketIPC'


// 用于pm2实际操作的核心模块,由client进行调用
// God与Client的通信由socket进行
export default class God {
  public IPCServer = new SocketIPCServer(this) // ws通信模块
  public configManager = new ConfigManager() // 配置中心

  constructor() { }

  // 首次运行Deamon    // 构建配置
  prepare(pid: number) {
    const appConfig = this.configManager.create("Deamon")
    appConfig.pid = pid
  }

  // 获取所有process数据
  sendMonitorInfo() {
    const procs = this.configManager.getAll()
    const message: IPCMessage = { type: "data", data: procs }
    this.IPCServer.sendClient(message)
  }

  // 执行client传来的action
  execute(action: IPCMessage) {
    const args = action.args || []
    console.log(`God execute action ${action.action}`);

    switch (action.action) {
      case "prepare": this.prepare(args[0])
        break;
      case "getMonitorInfo": this.sendMonitorInfo()
        break;
      default: console.log(`Unknow Action:${action.action}`);
        break;
    }
  }

  // 进行通知
  notify() { }

  // forkMode创建进程
  forkMode(pm2_env: AppConfig) {
    let spawn = require('child_process').spawn;

    let command = "node" || ""

    let spawnArgs: string[] = [pm2_env.scriptFullPath as string]

    let spawnOptions = {
      env: pm2_env,
      detached: true,
      cwd: pm2_env.cwd || process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      shell: false,
      windowsHide: true
    }

    try {
      console.log(`App [${pm2_env.name}:${pm2_env.id}] 由-Fork-模式启动`)

      var child_process = spawn(command, spawnArgs, spawnOptions)

    } catch (e) {
      this.logAndGenerateError(e)
    }


    // 处理子进程的输出信息
    child_process.stdout.on('data', (data: any) => {
      console.log(data.toString());
    });

    // 处理子进程的错误信息
    child_process.stderr.on('data', (err: any) => {
      console.error(err.toString());
    });

  }

  // clusterMode创建进程
  clusterMode() { }

  // 错误上报
  logAndGenerateError(e: any) {
    throw new Error(e)
  }


}





// ----------------------running------------------------
(() => {
  const god = new God()

  setInterval(() => {
    console.log("-----Deamon Running-----");
  }, 1000 * 10)
})()
