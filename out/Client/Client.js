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
const node_fs_1 = __importDefault(require("node:fs"));
const RPC_1 = require("../common/RPC");
const Utils_1 = require("./Utils");
const node_child_process_1 = require("node:child_process");
const LogManager_1 = __importDefault(require("../common/LogManager"));
// PM2调用客户端
class ProgressManagerClient {
    constructor(config) {
        this.RPCClient = new RPC_1.RPCClient(4000);
        this.logManager = new LogManager_1.default();
        this.envManager = new Utils_1.GlobalEnv();
        this.config = {};
        this._parseConfig(config);
        this.launchDaemon();
    }
    // 执行远程命令,通过RPC直接调用Daemon方法
    executeRemote(command, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.RPCClient.call(command, args);
        });
    }
    // 启动守护进程
    launchDaemon() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._checkDaemon())
                return;
            const daemon = this._spawnDaemon();
            this.envManager.setEnv("LZY_PM2_RUNNING", "true");
            this.envManager.setEnv("LZY_PM2_PID", daemon.pid);
            console.log(`Daemon Running PID:${daemon.pid}`);
        });
    }
    // 杀死守护进程
    killDaemon() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    // 创建守护进程
    _spawnDaemon() {
        const DaemonJS = path_1.default.resolve(__dirname, "../Daemon/Daemon.js");
        const DAEMON_LOG_FILE_PATH = path_1.default.resolve(__dirname, "../../cache/0_logFile.json");
        const outStream = node_fs_1.default.openSync(DAEMON_LOG_FILE_PATH, "a");
        let daemon_process = (0, node_child_process_1.spawn)("node", [DaemonJS], {
            detached: true,
            cwd: process.cwd(),
            windowsHide: true,
            env: Object.assign({}, process.env),
            // 守护进程的输出到专门的日志文件
            // 只有当父进程未链接子进程IO时, 子进程才能单独保持
            stdio: ['ignore', outStream, outStream, 'ignore'],
        });
        daemon_process.unref();
        // 处理子进程的输出信息
        // if (this.config.showDaemonLog) {
        //   daemon_process.stdout?.on('data', (data: any) => {
        //     console.log(data.toString());
        //   });
        // daemon_process.stderr.on('data', (err: any) => {
        //   console.error(err.toString());
        // });
        // daemon_process.on('message', (msg: any) => {
        //   console.log(`Received message from other process : ${msg}`);
        // });
        // }
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
    // 解析config字段
    _parseConfig(config) {
        const defaultConfig = {};
        if (typeof config !== "undefined") {
            defaultConfig.showDaemonLog = config.showDaemonLog || false;
        }
        this.config = defaultConfig;
        return this.config;
    }
}
exports.default = ProgressManagerClient;
