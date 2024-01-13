"use strict";
/******************************************
 * 用于定义所有对Client暴露的调用方法
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
class ActionMethods {
    constructor(god) {
        this.god = god;
        this._exposeAPI();
    }
    // 暴露ActionMethods上所有公共方法
    _exposeAPI() {
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        const exposeMethods = methodNames
            .filter(name => name != "constructor" && name[0] != "_")
            .map(name => {
            const wrappedFn = (...args) => {
                console.log(`触发Action :${name}`);
                return this[name].call(this, ...args);
            };
            this.god.RPCServer.expose(name, wrappedFn);
            return name;
        });
        console.log("暴露方法", exposeMethods);
    }
    // 获取所有process数据
    getMonitorData() {
        return this.god.clusterDB.getAll();
    }
    // 获取日志文件路径
    getProcessLogsFile(id) {
        const config = this.god.clusterDB.get(id);
        return config === null || config === void 0 ? void 0 : config.logPath;
    }
    // 创建子进程
    createProcess(tpl) {
        const newConfig = this.god.clusterDB.create(tpl);
        const child_process = newConfig.mode === "fork"
            ? this.god.forker.forkMode(newConfig)
            : this.god.forker.clusterMode(newConfig);
        if (typeof child_process !== 'undefined') {
            newConfig.pid = child_process.pid;
            newConfig.status = "running";
            this.god.logManager.startLogging(child_process, newConfig);
        }
    }
    // TODO 停止进程  kill进程 但持续监控  可重启
    stopProcess(id) {
        const config = this.god.clusterDB.get(id);
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
    // TODO 删除进程  kill进程 移除监控Cron
    deleteProcess(id) {
        const config = this.god.clusterDB.get(id);
        const { result: stopSucceed, pid } = this.stopProcess(id);
        // 成功停止
        if (stopSucceed) {
            this.god.clusterDB.remove(id);
            console.log(`成功删除进程  PID:${pid}`);
            return { result: true, pid };
        }
        // 已经停止
        else if ((config === null || config === void 0 ? void 0 : config.status) == "stop" && !stopSucceed) {
            this.god.clusterDB.remove(id);
            console.log(`成功删除进程  PID:${pid}`);
            return { result: true, pid };
        }
        // 停止失败
        else {
            console.log(`删除进程失败  PID:${pid}`);
            return { result: false, pid };
        }
    }
    // kill守护进程
    killMe() {
        this.god.RPCServer.unBind();
        this.god.pubServer.unBind();
        process.exit(1);
    }
}
exports.default = ActionMethods;
