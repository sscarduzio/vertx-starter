var vertx = require('vertx');
var container = require('vertx/container');

container.deployVerticle('webclient.js');

var server = vertx.createHttpServer();

// Serve the static resources
server.requestHandler(function(req) {
  if (req.uri() == "/") req.response.sendFile("eventbusbridge/index.html")
  if (req.uri() == "/vertxbus.js") req.response.sendFile("eventbusbridge/vertxbus.js")
})

// Initialize the SockJS bridge
vertx.createSockJSServer(server).bridge({prefix: "/eventbus"}, [{address: 'webclient_address'}], [{}]);

server.listen(8080);
