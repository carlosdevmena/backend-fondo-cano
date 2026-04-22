"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { pool } = require("../../db/pool");
async function findAdminByEmail(email) {
    const query = `
    SELECT id, email, password_hash, role, is_active
    FROM usuarios_admin
    WHERE email = $1
    LIMIT 1
  `;
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
}
async function updateRefreshTokenHash(userId, refreshTokenHash) {
    const query = `
    UPDATE usuarios_admin
    SET refresh_token_hash = $2,
        updated_at = NOW()
    WHERE id = $1
  `;
    await pool.query(query, [userId, refreshTokenHash]);
}
module.exports = { findAdminByEmail, updateRefreshTokenHash };
