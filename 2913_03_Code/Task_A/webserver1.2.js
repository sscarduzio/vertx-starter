var vertx = require('vertx');

vertx.createHttpServer().requestHandler(function(request){
        request.response.end("HTTPServer says Hello!");
}).listen(8080, 'localhost');
