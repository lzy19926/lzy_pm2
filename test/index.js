
const PM2 = require('../out/Client/API').default
const path = require('path')

const pm2 = new PM2({ showDaemonLog: true })

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, time * 1000)
  })
}


async function run() {
  pm2.start(path.resolve(__dirname, "./child_process.js"))
  await sleep(2)

  // pm2.list()
  await sleep(2)

  // pm2.logs("1")
  await sleep(2)

  // pm2.kill()
  await sleep(2)
}





(async () => {
  await run()

  setTimeout(() => {
    process.exit(1)
  }, 2000)
})()
