/******************************************
 * 用于定义所有对Client暴露的调用方法
 * 通过子类组合到God中
 *  @author lzy19926
*******************************************/

import type God from "./God"

export default class ActionMethods {
  constructor(private god: God) { }

  foo() { this.god.clusterDB.create()}
}
