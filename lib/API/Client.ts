import path from 'path'
import fs from 'fs'
import { SocketIPCClient } from '../common/SocketIPC'



// PM2调用客户端
export default class ProgressManagerClient {
  private _env: any
  private _envFilePath: string = ""
  private IPCClient = new SocketIPCClient()

  constructor() {
    this.launchDaemon()
  }


  // 启动一个PM2客户端作为守护进程
  launchDaemon() {
    if (this._checkDaemon()) return

    const deamonPID = this._createDaemon().pid

    // 修改全局env
    this.setEnv("LZY_PM2_RUNNING", "true")
    this.setEnv("LZY_PM2_PID", deamonPID)
    //
    console.log(`Deamon Running PID:${deamonPID}, WS:7888`);
  }

  // 杀死守护进程
  killDaemon() {
    const pid = this.getEnv("LZY_PM2_PID")
    try {
      process.kill(pid, 'SIGTERM');
      this.setEnv("LZY_PM2_RUNNING", "false")
      this.setEnv("LZY_PM2_PID", "")

      console.log(`Deamon killed SUCCESS PID:${pid}`);
    } catch (e) {
      console.log(`Deamon killed FAILED PID:${pid}`);
      console.error(e)
    }
  }

  // 创建守护进程
  private _createDaemon() {
    const scriptPath = path.resolve(__dirname, "../core/god")

    let deamon_process = require('child_process').spawn("node", [scriptPath], {
      detached: true,
      cwd: process.cwd(),
      windowsHide: true,
      env: Object.assign({}, process.env),
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    });

    //TODO 守护进程的输出到专门的日志文件
    // 处理子进程的输出信息
    // deamon_process.stdout.on('data', (data: any) => {
    //   console.log(data.toString());
    // });

    // 处理子进程的错误信息
    // deamon_process.stderr.on('data', (err: any) => {
    //   console.error(err.toString());
    // });

    // 处理子进程的接受数据
    // deamon_process.on('message', (msg: any) => {
    //   console.log(`Received message from other process : ${msg}`);
    // });

    return deamon_process
  }

  // 检查是否已经运行Deamon
  private _checkDaemon(): boolean {
    const isPM2Running = this.getEnv("LZY_PM2_RUNNING")
    const pid = this.getEnv("LZY_PM2_PID")

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

  // PM2全局环境变量修改
  private initEnv() {
    this._envFilePath = path.resolve(__dirname, "../../env.json")
    this._env = JSON.parse(fs.readFileSync(this._envFilePath, 'utf-8'))
    return this._env
  }

  setEnv(key: string, value: string) {
    this._env[key] = value
    const content = JSON.stringify(this._env)
    fs.writeFileSync(this._envFilePath, content, 'utf-8')
  }

  getEnv(key: string) {
    if (!this._env) {
      this.initEnv()
    }
    return this._env[key]
  }
}