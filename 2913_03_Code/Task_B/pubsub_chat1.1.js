var vertx = require('vertx')

var server = vertx.createNetServer().connectHandler(function(socket) {
   // Composing a client address string
   addr = socket.remoteAddress();
   addr = addr.ipaddress + addr.port;
   socket.write('Welcome to the chat ' + addr  + '!');

    socket.dataHandler(function(data) {
        var now = new Date();
        now = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	var msg =  now + ' <' + addr + '> ' + data;
	socket.write(msg);
    })

}).listen(1234)
