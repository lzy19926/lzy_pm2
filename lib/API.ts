const path = require("path")
const god = require('./God')
const { showTerminalList } = require('./terminal-table')
import { configManager } from './ConfigManager'
import type { AppConfig } from "./ConfigManager"

// 判断是否是启动配置文件
function isConfigFile(cmd: string): boolean {
  return false
}

// 初步解析cmd  处理 <-->相关配置
function parseCommand(cmd: string) {
  const optionList = cmd.split("--").map(o => o.trim()) || []
  const scriptPath = optionList.shift()
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
      default: console.warn(`unknow option: ${option}`)
        break;
    }
  })

  return { scriptPath, options }
}

export default class API {

  private cwd: string = process.cwd(); // 当前终端目录
  constructor() { }

  start(cmd: string) {
    if (isConfigFile(cmd)) {
      this._startConfigJson(cmd, () => showTerminalList())
    } else {
      this._startScript(cmd, () => showTerminalList())
    }
  }

  _startConfigJson(cmd: string, cb: Function) { }

  _startScript(cmd: string, cb: Function) {

    // 解析cmd
    const { scriptPath, options } = parseCommand(cmd)

    // 异步执行
    startNewProcessPath()

    // 执行回调
    cb()

    // 通过path启动一个新的进程
    function startNewProcessPath() {

      const appConfig = configManager.create()
      appConfig.script = scriptPath
      appConfig.options = options
      appConfig.scriptFullPath = path.resolve(appConfig.cwd, appConfig.script)

      god.forkMode(appConfig)
    }
    // 通过path重启一个进程
    function restartExistingProcessPath() {

    }

  }

}
