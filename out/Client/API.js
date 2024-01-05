"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./Client"));
const Utils_1 = require("./Utils");
// 对外暴露的用户API
class API {
    constructor() {
        this.cwd = process.cwd(); // 当前终端目录
        this.client = new Client_1.default(); // PM2客户端
    }
    start(cmd) {
        if ((0, Utils_1.isConfigFile)(cmd)) {
            this._startConfigJson(cmd, () => this._showTerminalList());
        }
        else {
            this._startScript(cmd, () => this._showTerminalList());
        }
    }
    delete() { }
    deleteAll() { }
    _startConfigJson(cmd, cb) { }
    _startScript(cmd, cb) {
        const that = this;
        const { scriptPath, options } = (0, Utils_1.parseCommand)(cmd);
        startNewProcessPath();
        // 执行回调
        cb();
        // 通过path启动一个新的进程
        function startNewProcessPath() { }
        // 通过path重启一个进程
        function restartExistingProcessPath() { }
    }
    _showTerminalList() { }
}
exports.default = API;
