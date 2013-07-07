var vertx = require('vertx');

var httpServer = vertx.createHttpServer();

var requestHandler = function(request){
        req.response.end("HTTPServer says Hello!");
};

httpServer.requestHandler(requestHandler);

httpServer.listen(8080, 'localhost');
