"use strict";
/******************************************
 * LzyPM2客户端入口
 *  @author lzy19926
*******************************************/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const RPC_1 = require("../common/RPC");
const Utils_1 = require("./Utils");
const LogManager_1 = __importDefault(require("./LogManager"));
// PM2调用客户端
class ProgressManagerClient {
    constructor() {
        this.RPCClient = new RPC_1.RPCClient();
        this.envManager = new Utils_1.GlobalEnv();
        this.logManager = new LogManager_1.default();
    }
    // 执行远程命令,通过RPC直接调用Daemon方法
    executeRemote(command) { }
    // 启动一个PM2客户端作为守护进程
    launchDaemon() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._checkDaemon())
                return;
            const daemonPID = this._createDaemon().pid;
            // 修改全局env
            this.envManager.setEnv("LZY_PM2_RUNNING", "true");
            this.envManager.setEnv("LZY_PM2_PID", daemonPID);
            console.log(`Daemon Running PID:${daemonPID}`);
        });
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
    _createDaemon() {
        const DaemonJS = path_1.default.resolve(__dirname, "../Daemon/Daemon.js");
        let daemon_process = require('child_process').spawn("node", [DaemonJS], {
            detached: true,
            cwd: process.cwd(),
            windowsHide: true,
            env: Object.assign({}, process.env),
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        });
        //TODO 守护进程的输出到专门的日志文件
        // 处理子进程的输出信息
        daemon_process.stdout.on('data', (data) => {
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
            console.log(`LZY_PM2 Already Running: PID:${pid},WS:7888`);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = ProgressManagerClient;
