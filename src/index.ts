import server from "./server";
(async () => {
  await server.initServer(3000, "localhost");
  await server.initLocalDatabase();
  await server.autofillDatabase();
  console.log("Log of Env", process.env);
})();
