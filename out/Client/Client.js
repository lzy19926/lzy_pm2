"use strict";
/******************************************
 * LzyPM2客户端入口
 *  @author lzy19926
*******************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const RPC_1 = require("../common/RPC");
const Utils_1 = require("./Utils");
const LogManager_1 = __importDefault(require("./LogManager"));
const node_child_process_1 = require("node:child_process");
// PM2调用客户端
class ProgressManagerClient {
    constructor() {
        this.RPCClient = new RPC_1.RPCClient();
        this.envManager = new Utils_1.GlobalEnv();
        this.logManager = new LogManager_1.default();
    }
    // 执行远程命令,通过RPC直接调用Daemon方法
    executeRemote(command) { }
    // 启动守护进程
    launchDaemon() {
        if (this._checkDaemon())
            return;
        const daemon = this._spawnDaemon();
        // 修改全局env
        this.envManager.setEnv("LZY_PM2_RUNNING", "true");
        this.envManager.setEnv("LZY_PM2_PID", daemon.pid);
        console.log(`Daemon Running PID:${daemon.pid}`);
    }
    // 杀死守护进程
    killDaemon() {
        const pid = this.envManager.getEnv("LZY_PM2_PID");
        try {
            process.kill(pid, 'SIGTERM');
            this.envManager.setEnv("LZY_PM2_RUNNING", "false");
            this.envManager.setEnv("LZY_PM2_PID", "");
            console.log(`Daemon killed SUCCESS PID:${pid}`);
        }
        catch (e) {
            console.error(`Daemon killed FAILED PID:${pid}`, e);
        }
    }
    // 创建守护进程
    _spawnDaemon() {
        var _a;
        const DaemonJS = path_1.default.resolve(__dirname, "../Daemon/Daemon.js");
        let daemon_process = (0, node_child_process_1.spawn)("node", [DaemonJS], {
            detached: true,
            cwd: process.cwd(),
            windowsHide: true,
            env: Object.assign({}, process.env),
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        });
        //TODO 守护进程的输出到专门的日志文件
        // 处理子进程的输出信息
        (_a = daemon_process.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
            console.log(data.toString());
        });
        // 处理子进程的错误信息
        // daemon_process.stderr.on('data', (err: any) => {
        //   console.error(err.toString());
        // });
        // 处理子进程的接受数据
        // daemon_process.on('message', (msg: any) => {
        //   console.log(`Received message from other process : ${msg}`);
        // });
        return daemon_process;
    }
    // 检查是否已经运行Daemon
    _checkDaemon() {
        const isPM2Running = this.envManager.getEnv("LZY_PM2_RUNNING");
        const pid = this.envManager.getEnv("LZY_PM2_PID");
        if (isPM2Running == "true") {
            console.log(`LZY_PM2 Already Running: PID:${pid}`);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = ProgressManagerClient;
