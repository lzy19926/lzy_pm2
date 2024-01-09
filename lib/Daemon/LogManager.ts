/******************************************
 * TODO日志管理模块
 *  @author lzy19926
*******************************************/
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import * as Utils from '../common/Utils'

import type God from './God';
import type { ChildProcess } from 'child_process'
import type { AppConfig } from '../common/ClusterDB'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'

type Process = ChildProcess | ChildProcessWithoutNullStreams | NodeJS.Process

export default class LogManager {

  private CACHE_DIR: string = path.resolve(__dirname, "../../cache")

  constructor(private god: God) { }

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
      const contentJson = Utils.transformLogToJson(config, data, "LOG")
      writableStream.write(contentJson, onLogError)
    });

    // 处理进程的错误信息
    process.stderr?.on('data', (err: any) => {
      const contentJson = Utils.transformLogToJson(config, err, "ERROR")
      writableStream.write(contentJson, onLogError)
    });

    // 处理进程的接受信息
    process.stderr?.on('message', (data: any) => {
      const contentJson = Utils.transformLogToJson(config, data, "MESSAGE")
      writableStream.write(contentJson, onLogError)
    });

  }

  // 删除日志文件
  deleteLogCache(id: number) {
    const logPath = path.resolve(this.CACHE_DIR, `${id}_logFile.json`)
    fs.unlink(logPath, (err) => {
      console.log("日志文件删除失败", logPath, err);
    })
  }


}