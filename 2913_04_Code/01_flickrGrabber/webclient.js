var console = require('vertx/console');
var vertx = require('vertx');
var eb = vertx.eventBus;

console.log('Webclient deployed!');

var httpc = vertx.createHttpClient().host('ycpi-api.flickr.com').port('80');

eb.registerHandler('webclient_address', function(message, replier) {
	console.log('Received tag: ' + message);
	httpc.getNow("/services/feeds/photos_public.gne?tags=" + escape(message) + "&format=json&nojsoncallback=1", function(resp) {
		
		console.log("Got response " + resp.statusCode());
		
		resp.bodyHandler(function(respBody) {
			var body = respBody.toString();

			// Pre-processing buggy flickr's json
			body = body.replace(new RegExp("\\\\'", "g"), "'");

			replier(body);
		})
	});
});
