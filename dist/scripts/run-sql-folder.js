"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs/promises");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();
async function run(folderPath) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl)
        throw new Error("DATABASE_URL is required");
    const pool = new Pool({ connectionString: dbUrl });
    const client = await pool.connect();
    try {
        const files = (await fs.readdir(folderPath))
            .filter((file) => file.endsWith(".sql"))
            .sort();
        for (const file of files) {
            const fullPath = path.join(folderPath, file);
            const sql = await fs.readFile(fullPath, "utf8");
            // eslint-disable-next-line no-console
            console.log(`Running ${file}`);
            await client.query(sql);
        }
    }
    finally {
        client.release();
        await pool.end();
    }
}
module.exports = { run };
