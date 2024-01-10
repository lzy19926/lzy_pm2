/******************************************
 * 守护进程中执行的核心模块,提供核心功能(组合式)
 *  @author lzy19926
*******************************************/

import Forker from './Forker'
import ActionMethods from './Actions'
import LogManager from './LogManager'
import ClusterWatcher from './Watcher'
import { RPCServer } from '../common/RPC'
import ClusterDB from '../common/ClusterDB'
import { EventPubServer } from '../common/PubSub'

export default class God {

  public RPCServer = new RPCServer(4000)
  public pubServer = new EventPubServer(4001)
  public clusterDB = new ClusterDB(this)
  public forker = new Forker(this)
  public logManager = new LogManager(this)
  private actions = new ActionMethods(this)
  private watcher = new ClusterWatcher(this)


  constructor() { }


  // 进行通知
  notify() { }

  // 错误上报
  logAndGenerateError(e: any) {
    throw new Error(e)
  }

}
