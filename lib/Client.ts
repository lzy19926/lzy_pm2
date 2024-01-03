import ConfigManager from './ConfigManager'
import type { AppConfig } from "./ConfigManager"


// PM2单独启动的守护进程
export default class ProgressManagerClient {

  public configManager = new ConfigManager() // 配置中心

  constructor() { }


  // 启动一个PM2客户端作为守护进程
  run() {

  }
}