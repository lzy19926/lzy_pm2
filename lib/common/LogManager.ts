/******************************************
 * TODO日志管理模块
 *  @author lzy19926
*******************************************/
import fs from 'node:fs'
import os from 'node:os'
import readline from 'node:readline'
import path from 'node:path'
import dayjs from 'dayjs'
import type { ChildProcess } from 'child_process'
import type { AppConfig } from './ClusterDB'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'


type Process = ChildProcess | ChildProcessWithoutNullStreams | NodeJS.Process

export default class LogManager {

  private CACHE_DIR: string = path.resolve(__dirname, "../../cache")

  constructor() { }

  startLogging(process: Process, config: AppConfig) {
    const that = this
    const logPath = path.resolve(this.CACHE_DIR, `${config.id}_logFile.json`)
    const writableStream = fs.createWriteStream(logPath, { flags: "a" });

    const onLogError = (error: Error | null | undefined) => {
      error && console.error(`尝试添加新内容时发生错误： ${error}`);
    }

    config.logPath = logPath

    // 处理进程的输出信息
    process.stdout?.on('data', (data: any) => {
      const contentJson = that._transformLogToJson(config, data, "LOG")
      writableStream.write(contentJson, onLogError)
    });

    // 处理进程的错误信息
    process.stderr?.on('data', (err: any) => {
      const contentJson = that._transformLogToJson(config, err, "ERROR")
      writableStream.write(contentJson, onLogError)
    });

    // 处理进程的接受信息
    process.stderr?.on('message', (data: any) => {
      const contentJson = that._transformLogToJson(config, data, "MESSAGE")
      writableStream.write(contentJson, onLogError)
    });

  }

  //TODO 打印最后50行日志
  printLogs(config: AppConfig, lines: number = 50) {
    const that = this
    const stream = fs.createReadStream(config.logPath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream });

    rl.on("line", line => {
      console.log(that.__transformJsonToLine(line))
    })
  }

  // 删除日志文件
  deleteLogCache(id: number) {
    const logPath = path.resolve(this.CACHE_DIR, `${id}_logFile.json`)
    fs.unlink(logPath, (err) => {
      console.log("日志文件删除失败", logPath, err);
    })
  }

  private _transformLogToJson(config: AppConfig, data: any, type: string) {
    return JSON.stringify({
      message: data.toString().replace(/\n/g, ''),
      type: type,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      app_name: config.name
    }) + os.EOL
  }

  private __transformJsonToLine(json: string) {
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
}