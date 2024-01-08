/******************************************
 * LzyPM2对外暴露的API,用户直接调用
 * 与Client组合
 *  @author lzy19926
*******************************************/
import path from 'path'
import ProgressManagerClient from './Client'
import { parseCommand, isConfigFile } from './Utils'
import { showTerminalList } from '../common/terminal-table'

import type { AppConfig, AppConfigTpl } from '../common/ClusterDB'
import type { ClientConfig } from './Client'
// 对外暴露的用户API
export default class API {

  private cwd = process.cwd(); // 当前终端目录
  public client = new ProgressManagerClient(this.config) // PM2客户端

  constructor(private config?: ClientConfig) { }

  start(cmd: string) {
    if (isConfigFile(cmd)) {
      this._startConfigJson(cmd, () => this.list())
    } else {
      this._startScript(cmd, () => this.list())
    }
  }

  async logs(idOrName: number | string) {
    const list = await this.client.executeRemote("getMonitorData") as AppConfig[]

    const appConfig = list.find(cfg => cfg.id == idOrName || cfg.name == idOrName)

    if (!appConfig) return console.warn(`错误ID或Name:${idOrName}`)

    this.client.logManager.printLogs(appConfig, 50)
  }

  delete() { }

  deleteAll() { }


  // 显示所有进程列表
  async list() {
    const list = await this.client.executeRemote("getMonitorData")
    showTerminalList(list)
  }

  private _startConfigJson(cmd: string, cb: Function) { }

  private _startScript(cmd: string, cb: Function) {
    const that = this
    const { scriptPath, options } = parseCommand(cmd)

    startNewProcessPath()

    // 执行回调
    cb()

    // 通过path启动一个新的进程
    async function startNewProcessPath() {
      const configTpl: AppConfigTpl = {}
      configTpl.cwd = that.cwd
      configTpl.script = scriptPath
      configTpl.options = options
      configTpl.scriptFullPath = path.resolve(that.cwd, scriptPath)

      await that.client.executeRemote("forkModeCreateProcess", [configTpl])
    }
    // 通过path重启一个进程
    function restartExistingProcessPath() { }
  }
}
