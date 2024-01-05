/******************************************
 * 守护进程中执行的核心模块,提供核心功能(组合式)
 *  @author lzy19926
*******************************************/

import ActionMethods from './Actions'
import ClusterWatcher from './Watcher'
import Forker from './Forker'
import ClusterDB from './ClusterDB'


export default class God {

  private actions = new ActionMethods(this)
  public clusterDB = new ClusterDB(this)
  private forker = new Forker(this)
  private watcher = new ClusterWatcher(this)

  constructor() { }

  // 执行client传来的action
  execute() { }

  // 进行通知
  notify() { }

  // 错误上报
  logAndGenerateError(e: any) {
    throw new Error(e)
  }

}
