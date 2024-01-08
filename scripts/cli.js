const PM2 = require('../out/Client/API').default
const path = require('path')


const pm2 = new PM2({ showDaemonLog: true })
const client = pm2.client

const command = process.argv[2]

switch (command) {
  case "start":
    pm2.start(path.resolve(__dirname, '../test/child_process.js'))
    break;
  case "list":
    pm2.list();
    break;
  case "logs":
    pm2.logs(1);
    break;
  case "deleteAll":
    client.killDaemon();
    break;
}