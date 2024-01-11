"use strict";
/******************************************
 * 子进程状态监视器
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
class ClusterWatcher {
    constructor(god) {
        this.god = god;
    }
    //TODO 开启子进程时启动定时任务  监控/重启子进程
    watch() { }
}
exports.default = ClusterWatcher;
