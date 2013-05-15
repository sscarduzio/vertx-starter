var vertx = require('vertx')
var eb = require('event_bus')
var container = require('container')
var console = require('console');

container.deployVerticle('webclient.js');

vertx.createHttpServer().websocketHandler(function(ws) {
 if(ws.path() !== '/tag'){
 	console.log('rejecting path: ' + ws.path());
 	ws.reject();
 }
  ws.dataHandler( function(buffer) {
 
  	var tag = buffer.toString();
  	console.log("received tag: " + tag);
  	eb.send('webclient_address', tag, function(message) {
		// The webclient has returned a message!
	 	console.log('message: ' + message);
		ws.writeTextFrame(message.toString()); 
	});
  });  
})
.requestHandler(function(req) {
  if (req.uri() == "/") req.response.sendFile("index.html")
})
.listen(8081)

