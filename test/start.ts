
const API = require("../lib/API")
const path = require("path")



// 测试
const scriptPath = path.resolve(__dirname, "./child_process.js")
new API().start(`${scriptPath} --json --format`)