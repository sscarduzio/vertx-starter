var vertx = require('vertx')
var console = require('console');

var server = vertx.createNetServer().connectHandler(function(socket) {

  vertx.eventBus.registerHandler('broadcast_address', function(event){
  	socket.write(event);
  });
  
  socket.dataHandler(function(data) {
  	// Getting a timestamp
  	var now = new Date();
  	now = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  	
  	// Composing a client address string
  	addr = socket.remoteAddress();
 	addr = addr.ipaddress + addr.port;
    
    vertx.eventBus.publish('broadcast_address', now + ' <' + addr + '> ' + data);
  });
  
}).listen(1234)

