/******************************************
 * 终端列表显示组件
 *  @author lzy19926
*******************************************/

const Table = require("cli-tableau")
import type { AppConfig } from "./ClusterDB"

const extension = 2
const HEAD_WIDTH_MAP = {
  id: 5,
  name: 10,
  version: 9,
  mode: 9,
  pid: 10,
  uptime: 8,
  '↺': 6,
  status: 11,
  cpu: 10,
  watching: 10
}


function formatConfig(configs: AppConfig[]) {
  return configs.map(c => {
    return [c.id, c.name, "", "", c.pid, ""]
  })
}

export function showTerminalList(configs: AppConfig[]) {
  var table = new Table({
    head: Object.keys(HEAD_WIDTH_MAP),
    colWidths: Object.values(HEAD_WIDTH_MAP).map(w => w + extension),
    borders: true
  });

  table.push(...formatConfig(configs))

  const title =
    `
=======================================================================================================================
  阳九的PM2管理器          阳九的PM2管理器          阳九的PM2管理器          阳九的PM2管理器          阳九的PM2管理器
=======================================================================================================================
`

  console.log(title);
  console.log(table.toString());
}