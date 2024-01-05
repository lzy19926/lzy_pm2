"use strict";
/******************************************
 * 守护进程中执行的核心模块,提供核心功能(组合式)
 *  @author lzy19926
*******************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Actions_1 = __importDefault(require("./Actions"));
const Watcher_1 = __importDefault(require("./Watcher"));
const Forker_1 = __importDefault(require("./Forker"));
const ClusterDB_1 = __importDefault(require("./ClusterDB"));
const RPC_1 = require("../common/RPC");
class God {
    constructor() {
        this.actions = new Actions_1.default(this);
        this.clusterDB = new ClusterDB_1.default(this);
        this.forker = new Forker_1.default(this);
        this.watcher = new Watcher_1.default(this);
        this.RPCServer = new RPC_1.RPCServer();
        this.exposeAPI();
    }
    // 暴露ActionMethods上所有公共方法
    exposeAPI() {
        this.RPCServer.listen(4000);
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.actions));
        for (const name of methodNames) {
            if (name == "constructor")
                continue;
            if (name[0] == "_")
                continue;
            //@ts-ignore
            const fn = this.actions[name].bind(this.actions);
            this.RPCServer.expose("getMonitorData", fn);
            console.log("暴露方法", name);
        }
    }
    // 进行通知
    notify() { }
    // 错误上报
    logAndGenerateError(e) {
        throw new Error(e);
    }
}
exports.default = God;
