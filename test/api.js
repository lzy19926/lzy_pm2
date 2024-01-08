const PM2 = require('../out/Client/API').default
const path = require('path')


const api = new PM2({ showDaemonLog: true })
const client = api.client


// 启动脚本
api.start(path.resolve(__dirname, './child_process.js'))


// 打印日志
setTimeout(() => {
  api.logs(1)
}, 1000 * 1)


// 关闭pm2
setTimeout(() => {
  client.killDaemon()
}, 1000 * 3)