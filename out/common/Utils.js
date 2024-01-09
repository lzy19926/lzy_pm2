"use strict";
/******************************************
 * 使用的工具函数集
 *  @author lzy19926
*******************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformJsonToLine = exports.transformLogToJson = exports.GlobalEnv = exports.parseCommand = exports.isConfigFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const node_os_1 = __importDefault(require("node:os"));
const dayjs_1 = __importDefault(require("dayjs"));
// 判断是否是启动配置文件
function isConfigFile(cmd) {
    return false;
}
exports.isConfigFile = isConfigFile;
// 初步解析cmd  处理 <-->相关配置
function parseCommand(cmd) {
    const optionList = cmd.split("--").map(o => o.trim()) || [];
    const scriptPath = optionList.shift() || "";
    const options = {};
    optionList.forEach(option => {
        switch (option) {
            case "json":
                Object.assign(options, { json: true });
                break;
            case "format":
                Object.assign(options, { format: true });
                break;
            case "startup":
                Object.assign(options, { startup: true });
                break;
            case "flush":
                Object.assign(options, { flush: true });
                break;
            default:
                console.warn(`unknown option: ${option}`);
                break;
        }
    });
    return { scriptPath, options };
}
exports.parseCommand = parseCommand;
// PM2全局环境变量管理
class GlobalEnv {
    constructor() {
        this._envFilePath = "";
        this.initEnv();
    }
    initEnv() {
        this._envFilePath = path_1.default.resolve(__dirname, "../../cache/env.json");
        this._env = JSON.parse(fs_1.default.readFileSync(this._envFilePath, 'utf-8'));
        return this._env;
    }
    setEnv(key, value) {
        this._env[key] = value ? value : "";
        const content = JSON.stringify(this._env);
        fs_1.default.writeFileSync(this._envFilePath, content, 'utf-8');
    }
    getEnv(key) {
        if (!this._env) {
            this.initEnv();
        }
        return this._env[key];
    }
}
exports.GlobalEnv = GlobalEnv;
// 日志log转为JSON
function transformLogToJson(config, data, type) {
    return JSON.stringify({
        message: data.toString().replace(/\n/g, ''),
        type: type,
        timestamp: (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss'),
        app_name: config.name
    }) + node_os_1.default.EOL;
}
exports.transformLogToJson = transformLogToJson;
// 日志JSON转为输出行
function transformJsonToLine(json) {
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
exports.transformJsonToLine = transformJsonToLine;
