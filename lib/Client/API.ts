/******************************************
 * LzyPM2对外暴露的API,用户直接调用
 * 与Client组合
 *  @author lzy19926
*******************************************/
import path from 'path'
import fs from 'node:fs'
import readline from 'node:readline'
import * as Utils from '../common/Utils'
import ProgressManagerClient from './Client'
import { showTerminalList } from '../common/terminal-table'

import type { AppConfigTpl } from '../Daemon/ClusterDB'
import type { ClientConfig } from './Client'

export default class API {

  private cwd = process.cwd(); // 当前终端目录
  public client = new ProgressManagerClient(this.config) // PM2客户端

  constructor(private config?: ClientConfig) { }

  // 启动一个进程
  async start(cmd: string) {

    await this._prepareClient()

    if (Utils.isConfigFile(cmd)) {
      this._startConfigJson(cmd)
    } else {
      this._startScript(cmd)
    }
  }

  // 打印50行日志 重写这部分实现
  async logs(idOrName: string) {

    await this._prepareClient()

    const logPath = await this.client.executeRemote("getProcessLogsFile", [parseInt(idOrName)])

    if (!logPath) {
      return console.error(`错误id:${idOrName}`)
    }

    const stream = fs.createReadStream(logPath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream });

    rl.on("line", line => {
      const output = idOrName == "0"
        ? line
        : Utils.transformJsonToLine(line)

      console.log(output);
    })
  }

  // 显示所有进程列表
  async list() {
    await this._prepareClient()
    await this._showList()
  }

  // 停止一个进程
  async stop(idOrName: string) {
    if (idOrName == "0") {
      return console.log("关停Daemon请使用 lzy_pm2 kill命令")
    }

    const { result, pid } = await this.client.executeRemote("stopProcess", [parseInt(idOrName)])
    result === true
      ? console.log(`成功结束进程  PID:${pid}`)
      : console.log(`结束进程失败  PID:${pid}`)

    await this._showList()
  }

  //TODO 停止所有进程
  stopAll() {

  }

  //TODO 删除一个进程
  async delete(idOrName: string) {
    if (idOrName == "0") {
      return console.log("关停Daemon请使用 lzy_pm2 kill命令")
    }

    const { result, pid } = await this.client.executeRemote("deleteProcess", [parseInt(idOrName)])
    result === true
      ? console.log(`成功删除进程  PID:${pid}`)
      : console.log(`删除进程失败  PID:${pid}`)
  }

  //TODO 删除所有进程
  deleteAll(idOrName: string) {

  }

  // pm2整体关停
  kill() {
    this.client.killDaemon()
  }

  private async _prepareClient() {
    return await this.client.launchDaemon()
  }

  private async _startConfigJson(cmd: string) {

  }

  private async _startScript(cmd: string) {
    const that = this
    const { scriptPath, options } = Utils.parseCommand(cmd)

    await startNewProcessPath()

    await this._showList()

    // 通过path启动一个新的进程
    async function startNewProcessPath() {
      const configTpl: AppConfigTpl = {}
      configTpl.cwd = that.cwd
      configTpl.script = scriptPath
      configTpl.options = options
      configTpl.scriptFullPath = path.resolve(that.cwd, scriptPath)

      await that.client.executeRemote("createProcess", [configTpl])
    }
    // 通过path重启一个进程
    function restartExistingProcessPath() { }
  }

  private async _showList() {
    const list = await this.client.executeRemote("getMonitorData")
    showTerminalList(list)
  }
}
