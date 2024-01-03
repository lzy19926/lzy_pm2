
const ProgressManagerClient = require('../out/API/Client').default

const client = new ProgressManagerClient()
client.launchDaemon()

setTimeout(() => {
  client.killDaemon()
}, 1000 * 5)