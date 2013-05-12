package com.acme.vertx.starter.http_and_eventbus;

import org.vertx.java.core.Handler;
import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.http.RouteMatcher;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class WebServer extends Verticle {

	/**
	 * Verticle entry point, execution starts here.
	 */
	@Override
	public void start() {
		super.start();

		container.deployVerticle(WebClient.class.getName());

		// Configure the route matcher
		RouteMatcher rm = new RouteMatcher();
		rm.all("/tag/:theTag", new TagRequestHandler());
		rm.allWithRegEx(".*", new BadRequestHandler());

		// HTTP Server starts listening
		vertx.createHttpServer().requestHandler(rm).listen(8080);
	}

	
	/**
	 * Handle all kinds of bad requests.
	 * @author sscarduzio
	 *
	 */
	public class BadRequestHandler implements Handler<HttpServerRequest> {
		@Override
		public void handle(HttpServerRequest event) {
			event.response().end("ERROR: no tag provided!");
		}
	}

	
	/**
	 * A Handler for the tag feature
	 * @author sscarduzio
	 *
	 */
	public class TagRequestHandler implements Handler<HttpServerRequest> {

		@Override
		public void handle(final HttpServerRequest req) {

			req.bodyHandler(new Handler<Buffer>() {
				@Override
				public void handle(Buffer body) {
					String tag = req.params().get("theTag");
					if (tag == null || tag.trim().equals("")) {
						(new BadRequestHandler()).handle(req);
					}
					vertx.eventBus().send("webclient_address", tag, new Handler<Message<String>>() {
						@Override
						public void handle(Message<String> fromClient) {
							JsonArray ja = (new JsonObject(fromClient.body())).getArray("items");
							StringBuilder sb = new StringBuilder();
							sb.append("<html>");
							for (int i = 0; i < ja.size(); i++) {
								JsonObject pic = ja.get(i);
								sb.append("<h3>" + pic.getString("title") + "</h3>");
								sb.append("<img src=\"" + pic.getString("image") + "\" />");
								sb.append("<span style='padding:1em'>" + pic.getString("title") + "</span>");
								sb.append("<hr />\n");
							}
							sb.append("</html>");
							req.response().end(sb.toString());
						}

					});
				}

			});

		}
	}
}
