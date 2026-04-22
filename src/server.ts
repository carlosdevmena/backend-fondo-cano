const { app } = require("./app");
const { env } = require("./config/env");
const { pool } = require("./db/pool");

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${env.port}`);
});

const shutdown = async () => {
  // Cierre limpio: primero cerramos DB y luego HTTP.
  await pool.end();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
