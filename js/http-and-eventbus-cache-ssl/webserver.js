var vertx = require('vertx');
var eb = require("event_bus");
var container = require('container');
var console = require('console');
container.deployVerticle('webclient.js');

cache_map = vertx.getMap('webclient_address.cache');


// Create a route matcher for the HTTP server
var rm = new vertx.RouteMatcher();

// Handle the tag request
rm.get('/tag/:theTag', function(req) {
	tag = req.params().get('theTag');
	console.log("Looking for: " + tag);
	html = cache_map.get(tag);
	
	// Lookup the cache first
	if(html != null){
		console.log("cache hit");
		req.response.end(html);
		return;
	}
	
	console.log("cache miss");
	
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
		
		// Cache the html for the next request
		cache_map.put(tag, html);
		req.response.end(html);
	});
	
});

// Default route responds with an error message
rm.getWithRegEx('.*', function(req) {
	req.response.end("ERROR: fill the tag");
});

// Start the server
vertx.createHttpServer()
	.ssl(true)
	.keyStorePath('kstore.jks')
	.keyStorePassword('password')
	.requestHandler(rm).listen(8081);


