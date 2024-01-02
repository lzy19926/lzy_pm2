var Table = require('cli-tableau');

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


function showTerminalList(list: any[]) {
  var table = new Table({
    head: Object.keys(HEAD_WIDTH_MAP),
    colWidths: Object.values(HEAD_WIDTH_MAP).map(w => w + extension),
    borders: true
  });

  table.push(["", "", "", "", "", ""])
  console.log(`
  =======================================================================================================================
    阳九的PM2管理器          阳九的PM2管理器          阳九的PM2管理器          阳九的PM2管理器          阳九的PM2管理器
  =======================================================================================================================
  `);

  console.log(table.toString());
}


module.exports = { showTerminalList }