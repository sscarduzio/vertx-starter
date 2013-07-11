var console = require("vertx/console");
var vertx = require("vertx");
var eb = vertx.eventBus;
var sharedData = vertx.sharedData;

// Shared map for caching
cache_map = sharedData.getMap('webclient_address.cache');

console.log('Webclient deployed!');

var httpc = vertx.createHttpClient().host('ycpi-api.flickr.com').port('80');

eb.registerLocalHandler('webclient_address', function(message, replier) {
	console.log('Received: ' + message);
	body = cache_map.get(message);
	if(body != null){
	   console.log('cache hit: ' + message);
	   replier(body);
	   return;
	}
	console.log('cache miss: ' + message);
	
	httpc.getNow("/services/feeds/photos_public.gne?tags=" + escape(message) + "&format=json", function(resp) {
		
		console.log("Got response " + resp.statusCode());
		
		resp.bodyHandler(function(respBody) {
			var body = respBody.toString();

			// Pre-processing buggy flickr's json
			body = body.substring(body.indexOf('(') + 1, body.length - 1).trim()
			body = body.replace(new RegExp("\\\\'", "g"), "'");
			
			// Store result in cache
			cache_map.put(message, body);
			replier(body);
		})
	});
});