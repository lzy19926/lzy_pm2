/******************************************
 * 定义所有创建进程的方法
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/

import { spawn } from 'node:child_process'

import type God from "./God"
import type { AppConfig } from './ClusterDB'

export default class Forker {
  constructor(private god: God) { }

  // forkMode创建进程
  forkMode(pm2_env: AppConfig) {
    let command = "node" || ""

    let spawnArgs: string[] = [pm2_env.scriptFullPath as string]

    let spawnOptions: any = {
      env: pm2_env,
      detached: true,
      cwd: pm2_env.cwd || process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      shell: false,
      windowsHide: true
    }

    try {
      console.log(`App [${pm2_env.name}:${pm2_env.id}] 由-Fork-模式启动`)

      var child_process = spawn(command, spawnArgs, spawnOptions)

      return child_process

    } catch (e) {
      this.god.logAndGenerateError(e)
    }
  }

  // clusterMode创建进程
  clusterMode(pm2_env: AppConfig) { }
}