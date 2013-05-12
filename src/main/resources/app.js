var container = require("container")
var console = require("console")

container.deployVerticle("com.acme.vertx.Example.MyVerticle")

console.log("Deploying myverticle")