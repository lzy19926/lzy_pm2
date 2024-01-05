"use strict";
/******************************************
 * 守护进程入口类
 * 定义了进程相关功能,
 *  @author lzy19926
*******************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const God_1 = __importDefault(require("./God"));
const RPC_1 = require("../common/RPC");
class Daemon {
    constructor() {
        this.god = new God_1.default();
        this.RPCServer = new RPC_1.RPCServer();
    }
    start() {
        this.god.clusterDB.create("Daemon");
    }
}
// 运行Daemon
if (require.main === module) {
    var daemon = new Daemon();
    daemon.start();
    setInterval(() => console.log("-----Daemon Running-----"), 1000 * 1);
}
