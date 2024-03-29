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
    //TODO 提供name支持
    get(idOrName) {
        if (typeof idOrName == 'number') {
            return this._map.get(idOrName);
        }
    }
    // 获取全部config并排序
    getAll() {
        return Array
            .from(this._map.values())
            .sort((a, b) => a.id - b.id);
    }
    // 储存一个config
    set(config) {
        this._map.set(this._count, config);
        this._count++;
    }
    // 移除一个config
    remove(id) {
        return this._map.delete(id);
    }
    // 创建一个新Config
    create(tpl = {}) {
        let newConfig = {
            id: this._count,
            pid: -1,
            name: tpl.name || "default",
            cwd: tpl.cwd || process.cwd(),
            script: tpl.script || "",
            scriptFullPath: tpl.scriptFullPath || "",
            logPath: tpl.logPath || "",
            unstableRestart: 0,
            mode: tpl.mode || "fork",
            status: "pending",
            options: tpl.options || {},
        };
        this.set(newConfig);
        return newConfig;
    }
    // 配置校验
    verifyConfig(appConfig) {
        return appConfig;
    }
}
exports.default = ClusterDB;
