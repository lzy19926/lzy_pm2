"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigManager_1 = __importDefault(require("../core/ConfigManager"));
const SocketIPC_1 = require("../common/SocketIPC");
// 用于pm2实际操作的核心模块,由client进行调用
// God与Client的通信由socket进行
class God {
    constructor() {
        this.IPCServer = new SocketIPC_1.SocketIPCServer(); // ws通信模块
        this.configManager = new ConfigManager_1.default(); // 配置中心
    }
    // 首次运行Deamon    // 构建配置
    prepare(pid) {
        const appConfig = this.configManager.create("Deamon");
        appConfig.pid = pid;
    }
    executeApp() { }
    // 进行通知
    notify() { }
    // forkMode创建进程
    forkMode(pm2_env) {
        let spawn = require('child_process').spawn;
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
            var child_process = spawn(command, spawnArgs, spawnOptions);
        }
        catch (e) {
            this.logAndGenerateError(e);
        }
        // 处理子进程的输出信息
        child_process.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        // 处理子进程的错误信息
        child_process.stderr.on('data', (err) => {
            console.error(err.toString());
        });
    }
    // clusterMode创建进程
    clusterMode() { }
    // 错误上报
    logAndGenerateError(e) {
        throw new Error(e);
    }
}
exports.default = God;
// ----------------------running------------------------
(() => {
    const god = new God();
    god.prepare(0);
    setInterval(() => {
        console.log("-----Deamon Running-----");
    }, 1000 * 10);
})();
