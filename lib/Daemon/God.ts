/******************************************
 * 守护进程中执行的核心模块,提供进程控制主逻辑(组合式)
 *  @author lzy19926
*******************************************/

import Forker from './Forker'
import ActionMethods from './Actions'
import LogManager from './LogManager'
import ClusterWatcher from './Watcher'
import { RPCServer } from '../common/RPC'
import ClusterDB from './ClusterDB'
import { EventPubServer } from '../common/PubSub'

import type { AppConfigTpl } from './ClusterDB'
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

  // 创建子进程
  createProcess(tpl: AppConfigTpl) {
    const newConfig = this.clusterDB.create(tpl)

    const child_process = newConfig.mode === "fork"
      ? this.forker.forkMode(newConfig)
      : this.forker.clusterMode(newConfig)

    if (typeof child_process !== 'undefined') {
      newConfig.pid = child_process.pid as number
      newConfig.status = "running"
      this.logManager.startLogging(child_process, newConfig)
    }
  }

  // TODO 停止进程  kill进程 但持续监控  可重启
  stopProcess(id: number) {
    const config = this.clusterDB.get(id)
    const pid = config?.pid

    if (!pid) return { result: false, pid }

    try {
      process.kill(pid)
      config.status = "stop"
      console.log(`成功结束进程  PID:${pid}`)
      return { result: true, pid }
    } catch (e) {
      console.log(`结束进程失败  PID:${pid}`, e)
      return { result: false, pid }
    }
  }

  // TODO 删除进程  kill进程
  deleteProcess(id: number) {
    const config = this.clusterDB.get(id)
    const { result: stopSucceed, pid } = this.stopProcess(id)

    // 成功停止
    if (stopSucceed) {
      this.clusterDB.remove(id)
      console.log(`成功删除进程  PID:${pid}`)
      return { result: true, pid }
    }
    // 已经停止
    else if (config?.status == "stop" && !stopSucceed) {
      this.clusterDB.remove(id)
      console.log(`成功删除进程  PID:${pid}`)
      return { result: true, pid }
    }
    // 停止失败
    else {
      console.log(`删除进程失败  PID:${pid}`)
      return { result: false, pid }
    }
  }

  // kill守护进程
  killMe() {
    this.RPCServer.unBind()
    this.pubServer.unBind()
    process.exit(1)
  }
}
