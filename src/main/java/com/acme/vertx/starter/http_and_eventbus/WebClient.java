package com.acme.vertx.starter.http_and_eventbus;

import org.vertx.java.core.Handler;
import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpClient;
import org.vertx.java.core.http.HttpClientResponse;
import org.vertx.java.platform.Verticle;

public class WebClient extends Verticle {

	private static HttpClient	httpc;

	/**
	 * Verticle Entry point
	 */
	public void start() {
		// Create a single HTTP client for all the sessions
		httpc = vertx.createHttpClient().setHost("ycpi-api.flickr.com");

		vertx.eventBus().registerHandler("webclient_address", new Handler<Message<String>>() {
			@Override
			public void handle(final Message<String> msg) {
				fetchAndRespond(msg);
			}
		});
	}

	/**
	 * Segregation of business logic in a separate method. Methods like this must
	 * always returns void, not to break the async flow.
	 * 
	 * @param msg
	 */
	protected void fetchAndRespond(final Message<String> msg) {
		httpc.getNow("/services/feeds/photos_public.gne?tags=" + msg.body() + "&format=json", new Handler<HttpClientResponse>() {

			@Override
			public void handle(HttpClientResponse event) {
				System.out.println("Received HTTP status code: " + event.statusCode());

				event.bodyHandler(new Handler<Buffer>() {

					@Override
					public void handle(Buffer event) {

						// Adapt the JSON from Flickr
						String body = event.toString();
						String data = body.substring(body.indexOf("(") + 1, body.length() - 1).trim();
						data = data.replaceAll("\\\\'", "'");

						msg.reply(data);
					}
				});
			}
		});

	}

}
