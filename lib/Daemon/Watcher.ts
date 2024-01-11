/******************************************
 * 子进程状态监视器
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/

import God from './God';

export default class ClusterWatcher {
  constructor(private god: God) { }
  //TODO 开启子进程时启动定时任务  监控/重启子进程
  watch() { }
}