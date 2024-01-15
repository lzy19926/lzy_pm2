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
        return this.god.createProcess(tpl);
    }
    // 停止进程
    stopProcess(id) {
        return this.god.stopProcess(id);
    }
    // 删除进程
    deleteProcess(id) {
        return this.god.deleteProcess(id);
    }
    // kill守护进程
    killMe() {
        return this.god.killMe();
    }
}
exports.default = ActionMethods;
