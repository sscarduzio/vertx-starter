package com.acme.vertx.starter;

import org.vertx.java.core.Handler;
import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class WebServer extends Verticle {
	@Override
	public void start() {
		super.start();
		container.deployVerticle(WebClient.class.getName());
		
		 vertx.createHttpServer().requestHandler(new Handler<HttpServerRequest>(){
			 public void handle(final HttpServerRequest req) {
				
				 req.bodyHandler(new Handler<Buffer>(){
					@Override
					public void handle(Buffer body) {
						 String tag = req.uri().substring(1, req.uri().length());
						 if(tag == null || tag.trim().equals("")){
							 req.response().setStatusCode(400);
							 req.response().end("Bad request: no tags received");
							 return;
					 }
						 vertx.eventBus().send("webclient_address", tag, new Handler<Message<JsonArray>>(){
							@Override
							public void handle(Message<JsonArray> fromClient) {
								JsonArray ja = fromClient.body();
								StringBuilder sb = new StringBuilder();
								sb.append("<html>");
								for(int i = 0; i < ja.size(); i++){
									JsonObject pic = ja.get(i);
									sb.append("<div style='display:block;padding:1em'>");
									sb.append("<h3>" + pic.getString("title") + "</h3>");
									sb.append("<img src=\"" + pic.getString("image") + "\" />");
									sb.append("<span style='padding:1em'>" + pic.getString("title") + "</span>");
									sb.append("</div/><hr />\n");
								}
								sb.append("</html>");
								req.response().end(sb.toString());
							}
							 
						 });
					}
					 
				 });
				 
			 };
			 
		 }).listen(8080);
	}
	
}
