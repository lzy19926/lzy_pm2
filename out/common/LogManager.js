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
const node_os_1 = __importDefault(require("node:os"));
const node_readline_1 = __importDefault(require("node:readline"));
const node_path_1 = __importDefault(require("node:path"));
const dayjs_1 = __importDefault(require("dayjs"));
class LogManager {
    constructor() {
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
            const contentJson = that._transformLogToJson(config, data, "LOG");
            writableStream.write(contentJson, onLogError);
        });
        // 处理进程的错误信息
        (_b = process.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (err) => {
            const contentJson = that._transformLogToJson(config, err, "ERROR");
            writableStream.write(contentJson, onLogError);
        });
        // 处理进程的接受信息
        (_c = process.stderr) === null || _c === void 0 ? void 0 : _c.on('message', (data) => {
            const contentJson = that._transformLogToJson(config, data, "MESSAGE");
            writableStream.write(contentJson, onLogError);
        });
    }
    //TODO 打印最后50行日志
    printLogs(config, lines = 50) {
        const that = this;
        const stream = node_fs_1.default.createReadStream(config.logPath, { encoding: 'utf8' });
        const rl = node_readline_1.default.createInterface({ input: stream });
        rl.on("line", line => {
            console.log(that.__transformJsonToLine(line));
        });
    }
    // 删除日志文件
    deleteLogCache(id) {
        const logPath = node_path_1.default.resolve(this.CACHE_DIR, `${id}_logFile.json`);
        node_fs_1.default.unlink(logPath, (err) => {
            console.log("日志文件删除失败", logPath, err);
        });
    }
    _transformLogToJson(config, data, type) {
        return JSON.stringify({
            message: data.toString().replace(/\n/g, ''),
            type: type,
            timestamp: (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            app_name: config.name
        }) + node_os_1.default.EOL;
    }
    __transformJsonToLine(json) {
        const { type, message, app_name, timestamp } = JSON.parse(json);
        let COLORS = {
            red: "\x1b[0m",
            white: "\x1b[37m",
            green: "\x1b[32m",
            orange: "\x1b[33m"
        };
        let colorPrefix = COLORS.white;
        switch (type) {
            case "LOG":
                colorPrefix = COLORS.white;
                break;
            case "WARN":
                colorPrefix = COLORS.orange;
                break;
            case "ERROR":
                colorPrefix = COLORS.red;
                break;
            default:
                colorPrefix = COLORS.white;
                break;
        }
        const formatted = `${colorPrefix} [${type}] [${app_name}] ${timestamp}\n` +
            `${COLORS.white} ${message}`;
        return formatted;
    }
}
exports.default = LogManager;
