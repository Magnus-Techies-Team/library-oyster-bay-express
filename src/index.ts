import server from "./server";
(async () => {
  await server.initServer(3000, "localhost");
  console.log("Log of Env", process.env);
})();
