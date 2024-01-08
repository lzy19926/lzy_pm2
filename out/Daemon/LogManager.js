"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/******************************************
 * TODO日志管理模块
 *  @author lzy19926
*******************************************/
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const dayjs_1 = __importDefault(require("dayjs"));
class LogManager {
    constructor(god) {
        this.god = god;
    }
    startLogging(child_process, config) {
        const that = this;
        const logPath = node_path_1.default.resolve(__dirname, "../../cache", `${config.id}_logFile.json`);
        const writableStream = node_fs_1.default.createWriteStream(logPath, { flags: "a" });
        const onLogError = (error) => {
            error && console.error(`尝试添加新内容时发生错误： ${error}`);
        };
        // 处理子进程的输出信息
        child_process.stdout.on('data', (data) => {
            const contentJson = that._transformLogToJson(config, data, "LOG");
            writableStream.write(contentJson, onLogError);
        });
        // 处理子进程的错误信息
        child_process.stderr.on('data', (err) => {
            const contentJson = that._transformLogToJson(config, err, "ERROR");
            writableStream.write(contentJson, onLogError);
        });
        // 处理子进程的接受信息
        child_process.stderr.on('message', (data) => {
            const contentJson = that._transformLogToJson(config, data, "MESSAGE");
            writableStream.write(contentJson, onLogError);
        });
    }
    _transformLogToJson(config, data, type) {
        return JSON.stringify({
            message: data.toString(),
            type: type,
            timestamp: (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            app_name: config.name
        }) + '\n';
    }
    __transformJsonToLine() {
    }
}
exports.default = LogManager;
