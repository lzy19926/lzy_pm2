/******************************************
 * 用于定义所有对Client暴露的调用方法
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/

import type God from "./God"
import type { AppConfigTpl } from './ClusterDB'

export default class ActionMethods {
  constructor(private god: God) {
    this._exposeAPI()
  }

  // 暴露ActionMethods上所有公共方法
  _exposeAPI() {
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const exposeMethods = methodNames
      .filter(name => name != "constructor" && name[0] != "_")
      .map(name => {
        this.god.RPCServer.expose(name, ((this as any)[name]).bind(this))
        return name
      })

    console.log("暴露方法", exposeMethods);
  }

  // 获取所有process数据
  getMonitorData() {
    return this.god.clusterDB.getAll()
  }

  // 获取日志文件路径
  getProcessLogsFile(id: number) {
    const config = this.god.clusterDB.get(id)
    return config?.logPath
  }

  // 创建子进程
  forkModeCreateProcess(tpl: AppConfigTpl) {
    const newConfig = this.god.clusterDB.create(tpl)
    const child_process = this.god.forker.forkMode(newConfig)

    if (typeof child_process !== 'undefined') {
      newConfig.pid = child_process.pid as number
      this.god.logManager.startLogging(child_process, newConfig)
    }
  }
}
