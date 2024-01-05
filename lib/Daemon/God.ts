/******************************************
 * 守护进程中执行的核心模块,提供核心功能(组合式)
 *  @author lzy19926
*******************************************/

import ActionMethods from './Actions'
import ClusterWatcher from './Watcher'
import Forker from './Forker'
import ClusterDB from './ClusterDB'
import { RPCServer } from '../common/RPC'


export default class God {

  private actions = new ActionMethods(this)
  public clusterDB = new ClusterDB(this)
  private forker = new Forker(this)
  private watcher = new ClusterWatcher(this)
  private RPCServer = new RPCServer()

  constructor() {
    this.exposeAPI()
  }

  // 暴露ActionMethods上所有公共方法
  exposeAPI() {
    this.RPCServer.listen(4000)
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.actions));

    for (const name of methodNames) {
      if (name == "constructor") continue
      if (name[0] == "_") continue
      //@ts-ignore

      const fn = this.actions[name].bind(this.actions)


      this.RPCServer.expose("getMonitorData", fn)
      console.log("暴露方法", name);
    }
  }

  // 进行通知
  notify() { }

  // 错误上报
  logAndGenerateError(e: any) {
    throw new Error(e)
  }

}
