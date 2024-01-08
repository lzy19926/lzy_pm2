
const ProgressManagerClient = require('../out/Client/Client').default

const client = new ProgressManagerClient()

setTimeout(() => {
  client.killDaemon()
}, 1000 * 3)