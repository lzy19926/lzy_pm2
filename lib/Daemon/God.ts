/******************************************
 * 守护进程中执行的核心模块,提供核心功能(组合式)
 *  @author lzy19926
*******************************************/

import ActionMethods from './Actions'
import ClusterWatcher from './Watcher'
import Forker from './Forker'
import ClusterDB from '../common/ClusterDB'
import { RPCServer } from '../common/RPC'
import LogManager from './LogManager'

export default class God {

  public RPCServer = new RPCServer(4000)
  private actions = new ActionMethods(this)
  public clusterDB = new ClusterDB(this)
  public forker = new Forker(this)
  private watcher = new ClusterWatcher(this)
  public logManager = new LogManager(this)

  constructor() { }


  // 进行通知
  notify() { }

  // 错误上报
  logAndGenerateError(e: any) {
    throw new Error(e)
  }

}
