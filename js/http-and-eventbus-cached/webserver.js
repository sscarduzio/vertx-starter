var vertx = require('vertx');
var eb = require("event_bus");
var container = require('container');
var console = require('console');
container.deployVerticle('webclient.js');


// Handler for errors
function errorHandler(req){
	req.response.end("ERROR: missing or invalid tag provided");
}

// Handle the tag request feature
function tagRequestHandler(req) {
	tag = req.params().get('theTag');

	if(tag == null || tag.trim().length == 0){
		respondToError(req);
	}
	
	console.log("Looking for: " + tag);

	eb.send('webclient_address', tag, function(message) {
		// The webclient has returned a message!
		items = JSON.parse(message).items;

		out = '<html><h1>Results for ' + tag + '</h1>';
		for (var i = 0; i < items.length; i++) {
			out += '<h3>' + items[i].title + '</h3>';
			out += '<a href="' + items[i].link + '"><img src="' + items[i].media.m + '" /></a>';
			out += items[i].description;
		}
		out += '</html>';

		req.response.end(out);
	});
}

// Configure a route matcher for the HTTP server
var rm = new vertx.RouteMatcher();
rm.get('/tag/:theTag', tagRequestHandler(req));
// The default route responds with an error message
rm.getWithRegEx('.*', errorHandler(req));

// Actually create the HTTP server and start listening
vertx.createHttpServer().requestHandler(rm).listen(8080);