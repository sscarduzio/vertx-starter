package com.acme.vertx.starter;

import org.vertx.java.core.Handler;
import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpClient;
import org.vertx.java.core.http.HttpClientResponse;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class WebClient extends Verticle {

	private static HttpClient httpc;

	public void start() {
		httpc = vertx.createHttpClient().setHost("ycpi-api.flickr.com");
		vertx.eventBus().registerHandler("webclient_address", new Handler<Message<String>>() {
			@Override
			public void handle(final Message<String> msg) {
				fetch(msg.body(), new Handler<JsonArray>() {
					@Override
					public void handle(JsonArray results) {
						msg.reply(results);
					}
				});
			}
		});
	}

	private void fetch(String tag, final Handler<JsonArray> h) {
		httpc.getNow("/services/feeds/photos_public.gne?tags=" + tag + "&format=json", new Handler<HttpClientResponse>() {

			@Override
			public void handle(HttpClientResponse event) {
				System.out.println(event.statusCode());
				event.bodyHandler(new Handler<Buffer>() {

					@Override
					public void handle(Buffer event) {
						JsonArray toSend = new JsonArray();

						// Adapt the JSON from Flickr
						String body = event.toString();
						String data = body.substring(body.indexOf("(") + 1, body.length() - 1).trim();
						data = data.replaceAll("\\\\'", "'");

						JsonObject o = new JsonObject(data);

						JsonArray items = o.getArray("items");
						for (int i = 0; i < items.size(); i++) {
							JsonObject item = items.get(i);
							JsonObject aPic = new JsonObject();
							aPic.putString("description", item.getString("description"));
							aPic.putString("title", item.getString("title"));
							aPic.putString("image", item.getObject("media").getString("m"));
							toSend.addObject(aPic);
						}

						h.handle(toSend);
					}
				});
			}
		});
	}

}
