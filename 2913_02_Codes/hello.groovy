vertx.createHttpServer().requestHandler { req ->
  req.response.end "Hello World!"
}.listen(8080, "localhost")
