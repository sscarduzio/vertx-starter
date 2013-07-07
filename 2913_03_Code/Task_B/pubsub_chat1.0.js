var vertx = require('vertx')

var server = vertx.createNetServer().connectHandler(function(socket) {
   // Composing a client address string
   addr = socket.remoteAddress();
   addr = addr.ipaddress + addr.port;
   socket.write('Welcome to the chat ' + addr  + '!');

}).listen(1234)
