/******************************************
 * 用于存储所有子进程数据的数据库模块
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/

import type God from "./God"

export interface AppConfig {
  id: number
  pid: number
  name: string
  cwd: string
  script: string
  scriptFullPath: string
  logPath: string
  unstableRestart: number
  mode: "fork" | "cluster",
  status: "stop" | "running" | "pending" | "restarting" | "error"
  options: Record<string, boolean>
}

export type AppConfigTpl = Omit<Partial<AppConfig>, 'id' | 'pid'>


export default class ClusterDB {

  private _map = new Map<number, AppConfig>()
  private _count = 0
  constructor(private god: God) { }
  //TODO 提供name支持
  get(idOrName: string | number) {
    if (typeof idOrName == 'number') {
      return this._map.get(idOrName)
    }
  }

  // 获取全部config并排序
  getAll(): AppConfig[] {
    return Array
      .from(this._map.values())
      .sort((a, b) => a.id - b.id)
  }

  // 储存一个config
  set(config: AppConfig) {
    this._map.set(this._count, config)
    this._count++
  }

  // 移除一个config
  remove(id: number) {
    return this._map.delete(id)
  }

  // 创建一个新Config
  create(tpl: AppConfigTpl = {}): AppConfig {
    let newConfig: AppConfig = {
      id: this._count,
      pid: -1,
      name: tpl.name || "default",
      cwd: tpl.cwd || process.cwd(),
      script: tpl.script || "",
      scriptFullPath: tpl.scriptFullPath || "",
      logPath: tpl.logPath || "",
      unstableRestart: 0,
      mode: tpl.mode || "fork",
      status: "pending",
      options: tpl.options || {},
    };

    this.set(newConfig)
    return newConfig
  }

  // 配置校验
  verifyConfig(appConfig: AppConfig): AppConfig | Error {
    return appConfig
  }
}