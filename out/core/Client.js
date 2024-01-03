"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.killDeamon = exports.startDeamon = void 0;
const path_1 = __importDefault(require("path"));
const God_1 = __importDefault(require("./God"));
const ConfigManager_1 = __importDefault(require("./ConfigManager"));
const SocketIPC_1 = require("../common/SocketIPC");
// PM2单独启动的守护进程  Client自身即作为守护进程
class ProgressManagerClient {
    constructor() {
        this.configManager = new ConfigManager_1.default(); // 配置中心
        this.IPCServer = new SocketIPC_1.SocketIPCServer(); // ws通信模块
        this.god = new God_1.default(); // 核心操作模块
    }
    // 启动一个PM2客户端作为守护进程
    launchDaemon() {
        if (this._checkDaemon())
            return;
        const deamonPID = this._createDaemon().pid;
        // 修改全局env
        this.god.setEnv("LZY_PM2_RUNNING", "true");
        this.god.setEnv("LZY_PM2_PID", deamonPID);
        //
        console.log(`Deamon Running PID:${deamonPID}, WS:7888`);
    }
    // 创建守护进程
    _createDaemon() {
        const scriptPath = path_1.default.resolve(__filename);
        let deamon_process = require('child_process').spawn("node", [scriptPath], {
            detached: true,
            cwd: process.cwd(),
            windowsHide: true,
            env: Object.assign({}, process.env),
            stdio: ['ipc', 'pipe', 'pipe'], // 监听IPC中的stdin
        });
        // 处理子进程的输出信息
        deamon_process.stdout.on('data', (data) => {
            console.log(data.toString());
            const input = data.toString().trim();
            // handle Ctrl + C signals
            if (input === '\x03') {
                console.log(`Received ${input}. Starting cleanup.`);
                deamon_process.kill('SIGINT');
                process.exit(0);
            }
        });
        // 处理子进程的错误信息
        deamon_process.stderr.on('data', (err) => {
            console.error(err.toString());
        });
        // 处理子进程的接受数据
        deamon_process.on('message', (msg) => {
            console.log(`Received message from other process : ${msg}`);
        });
        deamon_process.un;
        // 构建配置
        const appConfig = this.configManager.create("Deamon");
        appConfig.pid = deamon_process.pid;
        return deamon_process;
    }
    // 检查是否已经运行Deamon
    _checkDaemon() {
        const isPM2Running = this.god.getEnv("LZY_PM2_RUNNING");
        const pid = this.god.getEnv("LZY_PM2_PID");
        if (isPM2Running == "true") {
            console.log(`LZY_PM2 Already Running: PID:${pid},WS:7888`);
            return true;
        }
        else {
            return false;
        }
    }
    // 杀死守护进程
    killDaemon() {
        const pid = this.god.getEnv("LZY_PM2_PID");
        try {
            process.kill(pid, 'SIGTERM');
            this.god.setEnv("LZY_PM2_RUNNING", "false");
            this.god.setEnv("LZY_PM2_PID", "");
            console.log(`Deamon killed SUCCESS PID:${pid}`);
        }
        catch (e) {
            console.log(`Deamon killed FAILED PID:${pid}`);
            console.error(e);
        }
    }
    pingDaemon() { }
    getAllProcess() { }
    getProcessByNameOrId() { }
    // 持续运行进程,监控子进程
    startWatch() {
        setInterval(() => {
            console.log("-----Deamon Running-----");
        }, 1000 * 10);
    }
    boardCase() { }
}
exports.default = ProgressManagerClient;
let client;
function startDeamon() {
    client = new ProgressManagerClient();
    client.launchDaemon();
    client.startWatch();
}
exports.startDeamon = startDeamon;
function killDeamon() {
    client === null || client === void 0 ? void 0 : client.killDaemon();
}
exports.killDeamon = killDeamon;
