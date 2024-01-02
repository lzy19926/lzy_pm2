const path = require("path")
const god = require('./God')
const { showTerminalList } = require('./terminal-table')


export interface AppConfig {
  id?: number
  name?: string
  cwd?: string
  script?: string
  scriptFullPath?: string
}


// 判断是否是启动配置文件
function isConfigFile(cmd: string): boolean {
  return false
}



// 解析处理 <-->相关配置
function parseOptions(options: string[]) {
  options.forEach(option => {
    switch (option) {
      case "json": console.log(`handle option: --json`)
        break;
      case "format": console.log(`handle option: --format`)
        break;
      case "startup": console.log(`handle option: --startup`)
        break;
      case "flush": console.log(`handle option: --flush`)
        break;
      default: console.warn(`unknow option: ${option}`)
        break;
    }
  })
}

// 配置校验
function verifyConfs(appConfig: AppConfig): AppConfig | Error {
  return appConfig
}


class API {

  cwd: string  // 当前项目根目录

  constructor() {
    this.cwd = process.cwd();
  }


  start(cmd: string) {
    if (isConfigFile(cmd)) {
      this._startConfigJson(cmd, () => showTerminalList())
    } else {
      this._startScript(cmd, () => showTerminalList())
    }
  }


  _startConfigJson(cmd: string, cb: Function) { }


  _startScript(cmd: string, cb: Function) {


    // 为此任务创建一个config
    let appConf: AppConfig = {};

    // 处理--系列配置
    const options = cmd.split("--").map(o => o.trim()) || []
    appConf.script = options.shift()
    parseOptions(options)

    // 校验配置
    if (verifyConfs(appConf) instanceof Error) {
      return false
    }

    // 异步执行
    const that = this
    startNewProcessPath()

    // 执行回调
    cb()

    // 通过path重启一个进程
    function restartExistingProcessPath() {

    }
    // 通过path启动一个新的进程
    function startNewProcessPath() {
      appConf.id = 1 //todo 自增ID
      appConf.name = "default"
      appConf.cwd = that.cwd
      appConf.scriptFullPath = path.join(that.cwd, appConf.script).trim()


      god.forkMode(appConf)
    }
  }


}


module.exports = API