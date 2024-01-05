
const ProgressManagerClient = require('../out/Client/Client').default

const client = new ProgressManagerClient()

client.launchDaemon()

const protoPropertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(client));

setTimeout(() => {
  client.killDaemon()
}, 1000 * 3)