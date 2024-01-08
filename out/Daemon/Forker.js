"use strict";
/******************************************
 * 定义所有创建进程的方法
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
class Forker {
    constructor(god) {
        this.god = god;
    }
    // forkMode创建进程
    forkMode(pm2_env) {
        let command = "node" || "";
        let spawnArgs = [pm2_env.scriptFullPath];
        let spawnOptions = {
            env: pm2_env,
            detached: true,
            cwd: pm2_env.cwd || process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
            shell: false,
            windowsHide: true
        };
        try {
            console.log(`App [${pm2_env.name}:${pm2_env.id}] 由-Fork-模式启动`);
            var child_process = (0, node_child_process_1.spawn)(command, spawnArgs, spawnOptions);
            // 处理子进程的输出信息
            child_process.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            // 处理子进程的错误信息
            child_process.stderr.on('data', (err) => {
                console.error(err.toString());
            });
            return child_process;
        }
        catch (e) {
            this.god.logAndGenerateError(e);
        }
    }
    // clusterMode创建进程
    clusterMode() { }
}
exports.default = Forker;
