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
    watch() { }
}
exports.default = ClusterWatcher;
