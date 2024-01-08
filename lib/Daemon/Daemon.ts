/******************************************
 * 守护进程入口类
 * 定义了进程相关功能,
 *  @author lzy19926
*******************************************/


import God from './God'


class Daemon {
  private god = new God()

  constructor() { }

  start() {
    const newConfig = this.god.clusterDB.create({ name: "Daemon" })
    newConfig.pid = process.pid
    setInterval(() => console.log("-----Daemon Running-----"), 1000 * 1)
  }

}



// 运行Daemon
if (require.main === module) {

  var daemon = new Daemon();

  daemon.start();
}