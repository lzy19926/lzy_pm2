import type { AppConfig } from "./ConfigManager"



// 用于pm2实际操作的核心模块,由client进行调用
// God与Client的通信由socket进行
export default class God {
  constructor() { }

  prepare() { }

  executeApp() { }

  // 进行通知
  notify() { }

  // forkMode创建进程
  forkMode(pm2_env: AppConfig) {
    let spawn = require('child_process').spawn;

    let command = "node" || ""

    let spawnArgs: string[] = [pm2_env.scriptFullPath as string]

    let spawnOptions = {
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

    } catch (e) {
      this.logAndGenerateError(e)
    }


    // 处理子进程的输出信息
    child_process.stdout.on('data', (data: any) => {
      console.log(data.toString());
    });

    // 处理子进程的错误信息
    child_process.stderr.on('data', (err: any) => {
      console.error(err.toString());
    });

  }

  // clusterMode创建进程
  clusterMode() { }

  // 错误上报
  logAndGenerateError(e: any) {
    throw new Error(e)
  }
}
