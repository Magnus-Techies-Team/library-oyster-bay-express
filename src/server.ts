import fastifyLoggerOptions from "./server/options/fastifyLoggerOptions";
import swaggerOptions from "./server/options/swaggerOptions";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastify from "fastify";
import Server from "./server/index";
import fastifyCorsOptions from "./server/options/fastifyCorsOptions";
import fastifyCookieOptions from "./server/options/fastifyCookieOptions";

const server = new Server(
  fastify({
    logger: fastifyLoggerOptions,
  })
);
server.registerPlugin({
  pluginInstance: fastifySwagger,
  options: swaggerOptions,
});
server.registerPlugin({
  pluginInstance: fastifyCors,
  options: fastifyCorsOptions,
});
server.registerPlugin({
  pluginInstance: fastifyCookie,
  options: fastifyCookieOptions,
});
server.registerPlugins();
server.registerControllers([]);
server.findReferencesSchemas();
server.addReferencesSchemas();

export default server;
