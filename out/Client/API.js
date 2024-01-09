"use strict";
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
/******************************************
 * LzyPM2对外暴露的API,用户直接调用
 * 与Client组合
 *  @author lzy19926
*******************************************/
const path_1 = __importDefault(require("path"));
const Client_1 = __importDefault(require("./Client"));
const Utils_1 = require("./Utils");
const terminal_table_1 = require("../common/terminal-table");
// 对外暴露的用户API
class API {
    constructor(config) {
        this.config = config;
        this.cwd = process.cwd(); // 当前终端目录
        this.client = new Client_1.default(this.config); // PM2客户端
    }
    start(cmd) {
        if ((0, Utils_1.isConfigFile)(cmd)) {
            this._startConfigJson(cmd, () => this.list());
        }
        else {
            this._startScript(cmd, () => this.list());
        }
    }
    logs(idOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            const l = yield this.client.executeRemote("getProcessLogs", [idOrName]);
            console.log(l);
        });
    }
    delete() { }
    deleteAll() { }
    // 显示所有进程列表
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.client.executeRemote("getMonitorData");
            (0, terminal_table_1.showTerminalList)(list);
        });
    }
    _startConfigJson(cmd, cb) { }
    _startScript(cmd, cb) {
        const that = this;
        const { scriptPath, options } = (0, Utils_1.parseCommand)(cmd);
        startNewProcessPath();
        // 执行回调
        cb();
        // 通过path启动一个新的进程
        function startNewProcessPath() {
            return __awaiter(this, void 0, void 0, function* () {
                const configTpl = {};
                configTpl.cwd = that.cwd;
                configTpl.script = scriptPath;
                configTpl.options = options;
                configTpl.scriptFullPath = path_1.default.resolve(that.cwd, scriptPath);
                yield that.client.executeRemote("forkModeCreateProcess", [configTpl]);
            });
        }
        // 通过path重启一个进程
        function restartExistingProcessPath() { }
    }
}
exports.default = API;
