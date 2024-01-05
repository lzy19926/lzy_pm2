
// Server
const rpc = require('axon-rpc')
const axon = require('axon')
const rep = axon.socket('rep');

var server = new rpc.Server(rep);
rep.bind(4000);
