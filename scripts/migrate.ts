const path = require("path");
const { run } = require("./run-sql-folder");

run(path.join(__dirname, "..", "db", "migrations"))
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Migrations completed");
    process.exit(0);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Migration error:", error.message);
    process.exit(1);
  });
