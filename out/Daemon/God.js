"use strict";
/******************************************
 * 守护进程中执行的核心模块,提供进程控制主逻辑(组合式)
 *  @author lzy19926
*******************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Forker_1 = __importDefault(require("./Forker"));
const Actions_1 = __importDefault(require("./Actions"));
const LogManager_1 = __importDefault(require("./LogManager"));
const Watcher_1 = __importDefault(require("./Watcher"));
const RPC_1 = require("../common/RPC");
const ClusterDB_1 = __importDefault(require("./ClusterDB"));
const PubSub_1 = require("../common/PubSub");
class God {
    constructor() {
        this.RPCServer = new RPC_1.RPCServer(4000);
        this.pubServer = new PubSub_1.EventPubServer(4001);
        this.clusterDB = new ClusterDB_1.default(this);
        this.forker = new Forker_1.default(this);
        this.logManager = new LogManager_1.default(this);
        this.actions = new Actions_1.default(this);
        this.watcher = new Watcher_1.default(this);
    }
    // 进行通知
    notify() { }
    // 错误上报
    logAndGenerateError(e) {
        throw new Error(e);
    }
    // 创建子进程
    createProcess(tpl) {
        const newConfig = this.clusterDB.create(tpl);
        const child_process = newConfig.mode === "fork"
            ? this.forker.forkMode(newConfig)
            : this.forker.clusterMode(newConfig);
        if (typeof child_process !== 'undefined') {
            this._onProcessStart(child_process, newConfig);
        }
    }
    // TODO 停止进程  kill进程 但持续监控  可重启
    stopProcess(id) {
        const config = this.clusterDB.get(id);
        const pid = config === null || config === void 0 ? void 0 : config.pid;
        if (!pid)
            return { result: false, pid };
        try {
            process.kill(pid);
            config.status = "stop";
            console.log(`成功结束进程  PID:${pid}`);
            return { result: true, pid };
        }
        catch (e) {
            console.log(`结束进程失败  PID:${pid}`, e);
            return { result: false, pid };
        }
    }
    // TODO 删除进程  kill进程
    deleteProcess(id) {
        const config = this.clusterDB.get(id);
        const { result: stopSucceed, pid } = this.stopProcess(id);
        // 成功停止
        if (stopSucceed) {
            this.clusterDB.remove(id);
            console.log(`成功删除进程  PID:${pid}`);
            return { result: true, pid };
        }
        // 已经停止
        else if ((config === null || config === void 0 ? void 0 : config.status) == "stop" && !stopSucceed) {
            this.clusterDB.remove(id);
            console.log(`成功删除进程  PID:${pid}`);
            return { result: true, pid };
        }
        // 停止失败
        else {
            console.log(`删除进程失败  PID:${pid}`);
            return { result: false, pid };
        }
    }
    // 处理中断退出重启逻辑
    unstableRestart(proc, pm2_env) {
        let overLimit = pm2_env.unstableRestart > 15;
        let restartDelay = 1000 * 3;
        pm2_env.status = "restarting";
        if (overLimit) {
            console.log(`Process ${pm2_env.id} has been restart over 15 times`);
            pm2_env.status = "error";
            return;
        }
        let restartTask = setTimeout(() => {
            console.log(`Process ${pm2_env.id} Restarting,times:${pm2_env.unstableRestart}`);
            const new_child_process = this.forker.forkMode(pm2_env);
            if (!new_child_process) {
                return this.unstableRestart(proc, pm2_env);
            }
            this._onProcessStart(new_child_process, pm2_env);
        }, restartDelay);
        pm2_env.unstableRestart++;
    }
    // kill守护进程
    killMe() {
        this.RPCServer.unBind();
        this.pubServer.unBind();
        process.exit(1);
    }
    _onProcessStart(proc, config) {
        config.pid = proc.pid;
        config.status = "running";
        this.logManager.startLogging(proc, config);
        proc.once("exit", (code, signal) => {
            config.status = "error";
            this.unstableRestart(proc, config);
        });
        proc.once("error", (err) => {
            config.status = "error";
            this.unstableRestart(proc, config);
        });
    }
}
exports.default = God;
