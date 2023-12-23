export default {
  transport: {
    level: "error",
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss Z",
      colorize: true,
      destination: 2,
    },
  },
  serializers: {
    res(reply) {
      return {
        statusCode: reply.statusCode,
      };
    },
    req(request) {
      return {
        method: request.method,
        url: request.url,
        path: request.routerPath,
        parameters: request.params,
        headers: request.headers,
      };
    },
  },
};
