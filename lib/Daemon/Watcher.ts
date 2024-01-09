/******************************************
 * 子进程状态监视器
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/

import God from './God';

export default class ClusterWatcher {
  constructor(private god: God) { }
  watch() { }
}