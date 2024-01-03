
const ProgressManagerClient = require('../out/API/Client').default

const client = new ProgressManagerClient()

setTimeout(() => {
  client.killDaemon()
}, 1000 * 5)