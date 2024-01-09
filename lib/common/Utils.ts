/******************************************
 * 使用的工具函数集
 *  @author lzy19926
*******************************************/

import path from 'path'
import fs from 'fs'
import os from 'node:os'
import dayjs from 'dayjs'

import type { AppConfig } from './ClusterDB'

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
    this._envFilePath = path.resolve(__dirname, "../../cache/env.json")
    this._env = JSON.parse(fs.readFileSync(this._envFilePath, 'utf-8'))
    return this._env
  }

  setEnv(key: string, value: any) {
    this._env[key] = value ? value : ""
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

// 日志log转为JSON
export function transformLogToJson(config: AppConfig, data: any, type: string) {
  return JSON.stringify({
    message: data.toString().replace(/\n/g, ''),
    type: type,
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    app_name: config.name
  }) + os.EOL
}

// 日志JSON转为输出行
export function transformJsonToLine(json: string) {
  const { type, message, app_name, timestamp } = JSON.parse(json)

  let COLORS = {
    red: "\x1b[0m",
    white: "\x1b[37m",
    green: "\x1b[32m",
    orange: "\x1b[33m"
  }

  let colorPrefix = COLORS.white
  switch (type) {
    case "LOG": colorPrefix = COLORS.white; break
    case "WARN": colorPrefix = COLORS.orange; break
    case "ERROR": colorPrefix = COLORS.red; break
    default: colorPrefix = COLORS.white; break
  }

  const formatted =
    `${colorPrefix} [${type}] [${app_name}] ${timestamp}\n` +
    `${COLORS.white} ${message}`

  return formatted
}