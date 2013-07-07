var vertx = require('vertx');

var httpServer = vertx.createHttpServer();

httpServer.requestHandler(function(request){
        request.response.end("HTTPServer says Hello!");
});

httpServer.listen(8080, 'localhost');
