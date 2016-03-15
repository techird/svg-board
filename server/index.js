require("ts-node/register");
var serve = require("./server.ts").serve;

var port = process.env.port || 8081;
serve(port);
