"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const { run } = require("./run-sql-folder");
run(path.join(__dirname, "..", "db", "seeds"))
    .then(() => {
    // eslint-disable-next-line no-console
    console.log("Seeds completed");
    process.exit(0);
})
    .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Seed error:", error.message);
    process.exit(1);
});
