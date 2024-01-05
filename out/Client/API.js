"use strict";
/******************************************
 * LzyPM2对外暴露的API,用户直接调用
 * 与Client组合
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
const terminal_table_1 = require("../common/terminal-table");
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
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.client.executeRemote("getMonitorData");
            (0, terminal_table_1.showTerminalList)(list);
        });
    }
    _startConfigJson(cmd, cb) { }
    _startScript(cmd, cb) {
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
