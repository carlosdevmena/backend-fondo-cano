"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require("pg");
const { env } = require("../config/env");
const pool = new Pool({
    connectionString: env.databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});
pool.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("Unexpected PostgreSQL pool error", err);
});
module.exports = { pool };
