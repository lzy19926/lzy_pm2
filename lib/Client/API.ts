/******************************************
 * LzyPM2对外暴露的API,用户直接调用
 * 与Client组合
 *  @author lzy19926
*******************************************/


import path from 'path'
import { showTerminalList } from '../common/terminal-table'
import ProgressManagerClient from './Client'
import { parseCommand, isConfigFile } from './Utils'

// 对外暴露的用户API
export default class API {

  private cwd = process.cwd(); // 当前终端目录
  public client = new ProgressManagerClient() // PM2客户端

  constructor() { }

  start(cmd: string) {
    if (isConfigFile(cmd)) {
      this._startConfigJson(cmd, () => this._showTerminalList())
    } else {
      this._startScript(cmd, () => this._showTerminalList())
    }
  }

  delete() { }

  deleteAll() { }


  async list() {
    this.client.showProgressList()
  }

  private _startConfigJson(cmd: string, cb: Function) { }

  private _startScript(cmd: string, cb: Function) {
    const { scriptPath, options } = parseCommand(cmd)

    startNewProcessPath()

    // 执行回调
    cb()

    // 通过path启动一个新的进程
    function startNewProcessPath() { }
    // 通过path重启一个进程
    function restartExistingProcessPath() { }
  }

  private _showTerminalList() { }
}
