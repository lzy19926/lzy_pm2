/******************************************
 * 用于存储所有子进程数据的数据库模块
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/

import type God from "../Daemon/God"

export interface AppConfig {
  id: number
  pid: number
  name: string
  cwd: string
  script: string
  scriptFullPath: string
  options: Record<string, boolean>
}

export type AppConfigTpl = Omit<Partial<AppConfig>, 'id' | 'pid'>


export default class ClusterDB {

  private _map = new Map<number, AppConfig>()
  private _count = 0
  constructor(private god: God) { }

  get(idOrName: number | string) { }

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

  // 创建一个新Config
  create(tpl: AppConfigTpl = {}): AppConfig {
    let newConfig: AppConfig = {
      id: this._count,
      pid: -1,
      name: tpl.name || "default",
      cwd: tpl.cwd || process.cwd(),
      script: tpl.script || "",
      scriptFullPath: tpl.scriptFullPath || "",
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