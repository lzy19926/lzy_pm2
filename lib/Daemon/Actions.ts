/******************************************
 * 用于定义所有对Client暴露的调用方法
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/

// TODO 标准化API返回

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
        const wrappedFn = (...args: any[]) => {
          console.log(`触发Action :${name}`);
          return (this as any)[name].call(this, ...args)
        }

        this.god.RPCServer.expose(name, wrappedFn)
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
  createProcess(tpl: AppConfigTpl) {
    return this.god.createProcess(tpl)
  }

  // 停止进程
  stopProcess(id: number) {
    return this.god.stopProcess(id)
  }

  // 删除进程
  deleteProcess(id: number) {
    return this.god.deleteProcess(id)
  }

  // kill守护进程
  killMe() {
    return this.god.killMe()
  }
}
