"use strict";
/******************************************
 * 用于存储所有子进程数据的数据库模块
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
class ClusterDB {
    constructor(god) {
        this.god = god;
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
        appConfig.id = this._count;
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
exports.default = ClusterDB;
