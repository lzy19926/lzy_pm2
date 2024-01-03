import API from "../lib/API"
import path from "path"



// 测试
const scriptPath = path.resolve(__dirname, "./child_process.js")
new API().start(`${scriptPath} --json --format`)