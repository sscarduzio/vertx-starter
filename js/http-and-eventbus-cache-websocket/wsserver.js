var http = require('http')
var eb = require('event_bus')
var container = require('container')
var console = require('console');

console.log('WebSocket server deployed!');

container.deployVerticle('webclient.js');

http.createHttpServer().websocketHandler(function(ws) {
 if(ws.path() !== '/tag'){
 	console.log('rejecting path: ' + ws.path());
 	ws.reject();
 }
  ws.dataHandler( function(buffer) {
 
  	var tag = buffer.toString();
  	console.log("received tag: " + tag);
  	eb.send('webclient_address', tag, function(message) {
		// The webclient has returned a message!
		ws.writeTextFrame(message.toString()); 
	});
  });  
})
.requestHandler(function(req) {
  if (req.uri() == "/") {
    console.log("serving index");
    req.response.sendFile("index.htm")
  }
})
.listen(8081)

