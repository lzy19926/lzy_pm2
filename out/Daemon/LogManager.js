"use strict";
/******************************************
 * TODO日志管理模块
 *  @author lzy19926
*******************************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const Utils = __importStar(require("../common/Utils"));
class LogManager {
    constructor(god) {
        this.god = god;
        this.CACHE_DIR = node_path_1.default.resolve(__dirname, "../../cache");
    }
    startLogging(process, config) {
        var _a, _b, _c;
        const that = this;
        const logPath = node_path_1.default.resolve(this.CACHE_DIR, `${config.id}_logFile.json`);
        const writableStream = node_fs_1.default.createWriteStream(logPath, { flags: "a" });
        const onLogError = (error) => {
            error && console.error(`尝试添加新内容时发生错误： ${error}`);
        };
        config.logPath = logPath;
        // 处理进程的输出信息
        (_a = process.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
            const contentJson = Utils.transformLogToJson(config, data, "LOG");
            writableStream.write(contentJson, onLogError);
        });
        // 处理进程的错误信息
        (_b = process.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (err) => {
            const contentJson = Utils.transformLogToJson(config, err, "ERROR");
            writableStream.write(contentJson, onLogError);
        });
        // 处理进程的接受信息
        (_c = process.stderr) === null || _c === void 0 ? void 0 : _c.on('message', (data) => {
            const contentJson = Utils.transformLogToJson(config, data, "MESSAGE");
            writableStream.write(contentJson, onLogError);
        });
    }
    // 删除日志文件
    deleteLogCache(id) {
        const logPath = node_path_1.default.resolve(this.CACHE_DIR, `${id}_logFile.json`);
        node_fs_1.default.unlink(logPath, (err) => {
            console.log("日志文件删除失败", logPath, err);
        });
    }
}
exports.default = LogManager;
