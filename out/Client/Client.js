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
const Utils_1 = require("../common/Utils");
const node_child_process_1 = require("node:child_process");
const PubSub_1 = require("../common/PubSub");
// PM2调用客户端
class ProgressManagerClient {
    constructor(config) {
        this.RPCClient = new RPC_1.RPCClient(4000);
        this.subClient = new PubSub_1.EventSubClient(4001);
        this.envManager = new Utils_1.GlobalEnv();
        this.config = {};
        this._parseConfig(config);
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
            if (yield this.pingDaemon())
                return;
            const daemon = this._spawnDaemon();
            this.envManager.setEnv("LZY_PM2_RUNNING", "true");
            this.envManager.setEnv("LZY_PM2_PID", daemon.pid);
            console.log(`Daemon Running PID:${daemon.pid}`);
        });
    }
    // 杀死守护进程(由进程内部关停)
    killDaemon() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.pingDaemon())) {
                return console.log(`Daemon Already Killed`);
            }
            this.executeRemote('killMe');
            this.envManager.setEnv("LZY_PM2_RUNNING", "false");
            this.envManager.setEnv("LZY_PM2_PID", "");
            console.log(`Daemon killed SUCCESS`);
        });
    }
    // ping守护进程(retry * 3)
    pingDaemon(retry = 3) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalRes = false;
            while (!finalRes && retry-- > 0) {
                finalRes = yield this.subClient.pingServer();
            }
            finalRes
                ? console.log("Daemon Alive")
                : console.log("Ping Daemon Failed");
            return finalRes;
        });
    }
    // 创建守护进程
    _spawnDaemon() {
        const DAEMON_LOG_FILE_PATH = path_1.default.resolve(__dirname, "../../cache/0_logFile.json");
        const outStream = node_fs_1.default.openSync(DAEMON_LOG_FILE_PATH, "a");
        const DaemonJS = path_1.default.resolve(__dirname, "../Daemon/Daemon.js");
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
        return daemon_process;
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
