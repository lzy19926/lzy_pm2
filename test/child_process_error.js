console.log("子进程运行");



setTimeout(() => {
  process.exit(1)
}, 2000)