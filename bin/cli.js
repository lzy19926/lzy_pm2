#!/usr/bin/env node
const PM2 = require('../out/Client/API').default
const path = require('path')


const pm2 = new PM2({ showDaemonLog: true })
const client = pm2.client

const command = process.argv[2]
const arg = process.argv[3]


console.log(command, arg);

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
    client.killDaemon();
    break;
}