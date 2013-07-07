var vertx = require('vertx');
var STATIC_FILES_DIRECTORY = "static";

vertx.createHttpServer().requestHandler(function(request) {
        // Asynchronously read from file and send to client
        request.response.sendFile(STATIC_FILES_DIRECTORY +  request.path());

}).listen(8080, 'localhost');

