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
            this.god.RPCServer.expose(name, (this[name]).bind(this));
            return name;
        });
        console.log("暴露方法", exposeMethods);
    }
    // 获取所有process数据
    getMonitorData() {
        return this.god.clusterDB.getAll();
    }
    // 创建子进程
    forkModeCreateProcess(tpl) {
        const newConfig = this.god.clusterDB.create(tpl);
        this.god.forker.forkMode(newConfig);
    }
}
exports.default = ActionMethods;
