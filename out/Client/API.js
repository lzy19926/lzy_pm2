"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const node_fs_1 = __importDefault(require("node:fs"));
const node_readline_1 = __importDefault(require("node:readline"));
const Utils = __importStar(require("../common/Utils"));
const Client_1 = __importDefault(require("./Client"));
const terminal_table_1 = require("../common/terminal-table");
class API {
    constructor(config) {
        this.config = config;
        this.cwd = process.cwd(); // 当前终端目录
        this.client = new Client_1.default(this.config); // PM2客户端
    }
    // 启动一个进程
    start(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._prepareClient();
            if (Utils.isConfigFile(cmd)) {
                this._startConfigJson(cmd);
            }
            else {
                this._startScript(cmd);
            }
        });
    }
    // 打印50行日志 重写这部分实现
    logs(idOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._prepareClient();
            const logPath = yield this.client.executeRemote("getProcessLogsFile", [parseInt(idOrName)]);
            if (!logPath) {
                return console.error(`错误id:${idOrName}`);
            }
            const stream = node_fs_1.default.createReadStream(logPath, { encoding: 'utf8' });
            const rl = node_readline_1.default.createInterface({ input: stream });
            rl.on("line", line => {
                const output = idOrName == "0"
                    ? line
                    : Utils.transformJsonToLine(line);
                console.log(output);
            });
        });
    }
    // 显示所有进程列表
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._prepareClient();
            yield this._showList();
        });
    }
    // 停止一个进程
    stop(idOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (idOrName == "0") {
                return console.log("关停Daemon请使用 lzy_pm2 kill命令");
            }
            const { result, pid } = yield this.client.executeRemote("stopProcess", [parseInt(idOrName)]);
            result === true
                ? console.log(`成功结束进程  PID:${pid}`)
                : console.log(`结束进程失败  PID:${pid}`);
            yield this._showList();
        });
    }
    //TODO 停止所有进程
    stopAll() {
    }
    // 删除一个进程
    delete(idOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (idOrName == "0") {
                return console.log("关停Daemon请使用 lzy_pm2 kill命令");
            }
            const { result, pid } = yield this.client.executeRemote("deleteProcess", [parseInt(idOrName)]);
            result === true
                ? console.log(`成功删除进程  PID:${pid}`)
                : console.log(`删除进程失败  PID:${pid}`);
            yield this._showList();
        });
    }
    //TODO 删除所有进程
    deleteAll(idOrName) {
    }
    // pm2整体关停
    kill() {
        this.client.killDaemon();
    }
    _prepareClient() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.launchDaemon();
        });
    }
    _startConfigJson(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    _startScript(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            const { scriptPath, options } = Utils.parseCommand(cmd);
            yield startNewProcessPath();
            yield this._showList();
            // 通过path启动一个新的进程
            function startNewProcessPath() {
                return __awaiter(this, void 0, void 0, function* () {
                    const configTpl = {};
                    configTpl.cwd = that.cwd;
                    configTpl.script = scriptPath;
                    configTpl.options = options;
                    configTpl.scriptFullPath = path_1.default.resolve(that.cwd, scriptPath);
                    yield that.client.executeRemote("createProcess", [configTpl]);
                });
            }
            // 通过path重启一个进程
            function restartExistingProcessPath() { }
        });
    }
    _showList() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.client.executeRemote("getMonitorData");
            (0, terminal_table_1.showTerminalList)(list);
        });
    }
}
exports.default = API;
