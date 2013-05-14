var vertx = require('vertx');
var eb = require("event_bus");
var container = require('container');
var console = require('console');
container.deployVerticle('webclient.js');

// Create a route matcher for the HTTP server
var rm = new vertx.RouteMatcher();

// Extract the params from the uri
rm.get('/tag/:theTag', function(req) {
	tag = req.params().get('theTag');
	console.log("Looking for: " + tag);

	eb.send('webclient_address', tag, function(message) {
		// The webclient has returned a message!
		items = JSON.parse(message).items;

		html = '<html><h1>Results for ' + tag + '</h1>';
		for (var i = 0; i < items.length; i++) {
			html += '<h3>' + items[i].title + '</h3>';
			html += '<a href="' + items[i].link + '"><img src="' + items[i].media.m + '" /></a>';
			html += items[i].description;
		}
		html += '</html>';

		req.response.end(html);
	});
});

// Default route responds with an error message
rm.getWithRegEx('.*', function(req) {
	req.response.end("ERROR: fill the tag");
});

// Start the server
vertx.createHttpServer().requestHandler(rm).listen(8081);