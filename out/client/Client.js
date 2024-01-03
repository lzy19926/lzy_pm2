"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigManager_1 = __importDefault(require("../core/ConfigManager"));
const path_1 = __importDefault(require("path"));
const God_1 = __importDefault(require("../core/God"));
// PM2单独启动的守护进程
class ProgressManagerClient {
    constructor() {
        this.configManager = new ConfigManager_1.default(); // 配置中心
        // public IPC = new SocketIPC() // ws通信模块
        this.god = new God_1.default(); // 核心操作模块
        this.launchDaemon();
    }
    // 启动一个PM2客户端作为守护进程
    launchDaemon() {
        const isPM2Running = this.god.getEnv("LZY_PM2_RUNNING");
        const pid = this.god.getEnv("LZY_PM2_PID");
        if (isPM2Running == "true")
            return console.log(`LZY_PM2 Already Running: PID:${pid}`);
        const scriptPath = path_1.default.resolve(__filename);
        var deamon_process = require('child_process').spawn("node", [scriptPath], {
            detached: true,
            cwd: process.cwd(),
            windowsHide: true,
            env: Object.assign({}, process.env),
            stdio: ['ipc', 'pipe', 'pipe'], // 监听IPC中的stdin
        });
        // 处理子进程的输出信息
        deamon_process.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        // 处理子进程的错误信息
        deamon_process.stderr.on('data', (err) => {
            console.error(err.toString());
        });
        // 处理子进程的接受数据
        deamon_process.on('message', (msg) => {
            console.log(`Received message from other process : ${msg}`);
        });
        // 修改全局env
        this.god.setEnv("LZY_PM2_RUNNING", "true");
        this.god.setEnv("LZY_PM2_PID", deamon_process.pid);
        //
        console.log(`Deamon Running PID:${deamon_process.pid}`);
    }
    killDaemon() {
        this.god.setEnv("LZY_PM2_RUNNING", "false");
    }
    pingDaemon() { }
    getAllProcess() { }
    getProcessByNameOrId() { }
    startWatch() { }
    boardCase() { }
}
exports.default = ProgressManagerClient;
