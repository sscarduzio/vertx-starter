var vertx = require('vertx')

var server = vertx.createNetServer().connectHandler(function(socket) {
   // Composing a client address string
   addr = socket.remoteAddress();
   addr = addr.ipaddress + addr.port;
  
   socket.write('Welcome to the chat ' + addr  + '!');
   
  vertx.eventBus.registerHandler('broadcast_address', function(event){
        socket.write(event);
  });
  
  socket.dataHandler(function(data) {
        var now = new Date();
        now = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	var msg =  now + ' <' + addr + '> ' + data;
	vertx.eventBus.publish('broadcast_address', msg);
    })

}).listen(1234)
