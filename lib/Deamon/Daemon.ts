/******************************************
 * 守护进程入口类
 * 定义了进程相关功能,
 *  @author lzy19926
*******************************************/


import God from './God'
import { RPCServer } from '../common/RPC'


class Daemon {
  private god = new God()
  private RPCServer = new RPCServer()

  constructor() { }


  start() { }
}



// 运行Daemon
if (require.main === module) {

  var daemon = new Daemon();

  daemon.start();
}