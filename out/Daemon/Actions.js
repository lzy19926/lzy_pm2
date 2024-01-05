"use strict";
/******************************************
 * 用于定义所有对Client暴露的调用方法
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/
Object.defineProperty(exports, "__esModule", { value: true });
class ActionMethods {
    constructor(god) {
        this.god = god;
    }
    // 获取所有process数据
    getMonitorData() { }
}
exports.default = ActionMethods;
