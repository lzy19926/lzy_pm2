#!/usr/bin/env node
const PM2 = require('../out/Client/API').default


const pm2 = new PM2({ showDaemonLog: true })

const command = process.argv[2]
const arg = process.argv[3]

switch (command) {
  case "start":
    pm2.start(arg)
    break;
  case "list":
    pm2.list();
    break;
  case "logs":
    pm2.logs(arg);
    break;
  case "kill":
    pm2.kill();
    break;
}


setTimeout(() => {
  process.exit(1)
}, 500)