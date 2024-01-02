
export interface AppConfig {
  id?: number
  name?: string
  cwd?: string
  script?: string
  scriptFullPath?: string
  options?: Record<string, boolean>
}






class ConfigManager {

  private _map = new Map<number, AppConfig>()
  private _count = 0
  constructor() { }

  get() { }

  // 创建一个新Config
  create() {
    let appConfig: AppConfig = {};

    appConfig.id = 1
    appConfig.name = "default"
    appConfig.cwd = process.cwd()

    this._map.set(this._count, appConfig)
    this._count++

    return appConfig
  }

  // 配置校验
  verifyConfig(appConfig: AppConfig): AppConfig | Error {
    return appConfig
  }
}

export const configManager = new ConfigManager()