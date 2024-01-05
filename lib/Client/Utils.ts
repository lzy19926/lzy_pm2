import path from 'path'
import fs from 'fs'

// 判断是否是启动配置文件
export function isConfigFile(cmd: string): boolean {
  return false
}

// 初步解析cmd  处理 <-->相关配置
export function parseCommand(cmd: string) {
  const optionList = cmd.split("--").map(o => o.trim()) || []
  const scriptPath = optionList.shift() || ""
  const options = {}

  optionList.forEach(option => {
    switch (option) {
      case "json": Object.assign(options, { json: true })
        break;
      case "format": Object.assign(options, { format: true })
        break;
      case "startup": Object.assign(options, { startup: true })
        break;
      case "flush": Object.assign(options, { flush: true })
        break;
      default: console.warn(`unknown option: ${option}`)
        break;
    }
  })

  return { scriptPath, options }
}

// PM2全局环境变量管理
export class GlobalEnv {

  private _env: any
  private _envFilePath: string = ""

  constructor() {
    this.initEnv()
  }

  private initEnv() {
    this._envFilePath = path.resolve(__dirname, "../../env.json")
    this._env = JSON.parse(fs.readFileSync(this._envFilePath, 'utf-8'))
    return this._env
  }

  setEnv(key: string, value: string) {
    this._env[key] = value
    const content = JSON.stringify(this._env)
    fs.writeFileSync(this._envFilePath, content, 'utf-8')
  }

  getEnv(key: string) {
    if (!this._env) {
      this.initEnv()
    }
    return this._env[key]
  }
}