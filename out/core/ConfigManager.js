"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigManager {
    constructor() {
        this._map = new Map();
        this._count = 0;
    }
    get(idOrName) { }
    // 获取全部config并排序
    getAll() {
        return Array
            .from(this._map.values())
            .sort((a, b) => a.id - b.id);
    }
    // 创建一个新Config
    create(name) {
        let appConfig = {};
        appConfig.id = 1;
        appConfig.name = name || "default";
        appConfig.cwd = process.cwd();
        appConfig.script = "";
        appConfig.options = {};
        appConfig.scriptFullPath = "";
        this._map.set(this._count, appConfig);
        this._count++;
        return appConfig;
    }
    // 配置校验
    verifyConfig(appConfig) {
        return appConfig;
    }
}
exports.default = ConfigManager;
