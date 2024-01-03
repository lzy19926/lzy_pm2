"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 用于pm2实际操作的核心模块,由client进行调用
// God与Client的通信由socket进行
class God {
    constructor() {
        this._envFilePath = "";
    }
    prepare() { }
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
    // PM2全局环境变量修改
    initEnv() {
        this._envFilePath = path_1.default.resolve(__dirname, "../env.json");
        this._env = JSON.parse(fs_1.default.readFileSync(this._envFilePath, 'utf-8'));
        return this._env;
    }
    setEnv(key, value) {
        this._env[key] = value;
        const content = JSON.stringify(this._env);
        fs_1.default.writeFileSync(this._envFilePath, content, 'utf-8');
    }
    getEnv(key) {
        if (!this._env) {
            this.initEnv();
        }
        return this._env[key];
    }
}
exports.default = God;
