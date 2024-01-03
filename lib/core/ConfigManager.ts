
export interface AppConfig {
  id: number
  name: string
  cwd: string
  script: string
  scriptFullPath: string
  options: Record<string, boolean>
  pid?: number
}


export default class ConfigManager {

  private _map = new Map<number, AppConfig>()
  private _count = 0
  constructor() { }

  get(idOrName: number | string) { }

  // 获取全部config并排序
  getAll(): AppConfig[] {
    return Array
      .from(this._map.values())
      .sort((a, b) => a.id - b.id)
  }
  // 创建一个新Config
  create(name?: string): AppConfig {

    let appConfig: any = {};

    appConfig.id = 1
    appConfig.name = name || "default"
    appConfig.cwd = process.cwd()
    appConfig.script = ""
    appConfig.options = {}
    appConfig.scriptFullPath = ""

    this._map.set(this._count, appConfig)
    this._count++

    return appConfig
  }

  // 配置校验
  verifyConfig(appConfig: AppConfig): AppConfig | Error {
    return appConfig
  }
}