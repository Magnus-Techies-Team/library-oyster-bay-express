export default {
  routePrefix: "/docs",
  exposeRoute: true,
  deepLinking: true,
  swagger: {
    info: {
      title: "Library-OBE",
      description: "Documentation for Library-OBE back-end",
      version: "0.0.1",
    },
    host: "localhost",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  refResolver: {
    buildLocalReference(json, baseUri, fragment, i) {
      console.log("refResolver: ", json, baseUri, fragment, i);
      return json.$id || `tap-${i}`;
    },
  },
};
