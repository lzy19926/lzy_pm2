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
const node_path_1 = __importDefault(require("node:path"));
class Daemon {
    constructor() {
        this.god = new God_1.default();
    }
    start() {
        const newConfig = this.god.clusterDB.create({ name: "Daemon" });
        newConfig.pid = process.pid;
        newConfig.logPath = node_path_1.default.resolve(__dirname, "../../cache/0_logFile.json");
        setInterval(() => console.log("-----Daemon Running-----"), 1000 * 60);
    }
}
// 运行Daemon
if (require.main === module) {
    var daemon = new Daemon();
    daemon.start();
}
