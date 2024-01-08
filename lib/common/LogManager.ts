/******************************************
 * TODO日志管理模块
 *  @author lzy19926
*******************************************/
import fs from 'node:fs'
import path from 'node:path'
import dayjs from 'dayjs'
import type { AppConfig } from './ClusterDB'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'

export default class LogManager {
  constructor() { }

  startLogging(child_process: ChildProcessWithoutNullStreams, config: AppConfig) {
    const that = this
    const logPath = path.resolve(__dirname, "../../cache", `${config.id}_logFile.json`)
    const writableStream = fs.createWriteStream(logPath, { flags: "a" });

    const onLogError = (error: Error | null | undefined) => {
      error && console.error(`尝试添加新内容时发生错误： ${error}`);
    }

    // 处理子进程的输出信息
    child_process.stdout.on('data', (data: any) => {
      const contentJson = that._transformLogToJson(config, data, "LOG")
      writableStream.write(contentJson, onLogError)
    });

    // 处理子进程的错误信息
    child_process.stderr.on('data', (err: any) => {
      const contentJson = that._transformLogToJson(config, err, "ERROR")
      writableStream.write(contentJson, onLogError)
    });

    // 处理子进程的接受信息
    child_process.stderr.on('message', (data: any) => {
      const contentJson = that._transformLogToJson(config, data, "MESSAGE")
      writableStream.write(contentJson, onLogError)
    });

  }

  //TODO 打印最后50行
  printLogs(id: number, lines: number = 50) {

  }

  _transformLogToJson(config: AppConfig, data: any, type: string) {
    return JSON.stringify({
      message: data.toString(),
      type: type,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      app_name: config.name
    }) + '\n'
  }

  __transformJsonToLine() {

  }

}