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
const ClusterDB_1 = __importDefault(require("../common/ClusterDB"));
const RPC_1 = require("../common/RPC");
const LogManager_1 = __importDefault(require("./LogManager"));
class God {
    constructor() {
        this.RPCServer = new RPC_1.RPCServer(4000);
        this.actions = new Actions_1.default(this);
        this.clusterDB = new ClusterDB_1.default(this);
        this.forker = new Forker_1.default(this);
        this.watcher = new Watcher_1.default(this);
        this.logManager = new LogManager_1.default(this);
    }
    // 进行通知
    notify() { }
    // 错误上报
    logAndGenerateError(e) {
        throw new Error(e);
    }
}
exports.default = God;
