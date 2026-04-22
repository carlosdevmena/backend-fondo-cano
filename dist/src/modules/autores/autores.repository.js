"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { pool } = require("../../db/pool");
async function listAutores() {
    const { rows } = await pool.query("SELECT * FROM autores ORDER BY nombre ASC");
    return rows;
}
async function getAutorById(id) {
    const { rows } = await pool.query("SELECT * FROM autores WHERE id = $1", [id]);
    return rows[0] || null;
}
async function createAutor(payload) {
    const query = `
    INSERT INTO autores(nombre, biografia, fecha_nac, fecha_muerte)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
    const values = [
        payload.nombre,
        payload.biografia ?? null,
        payload.fecha_nac ?? null,
        payload.fecha_muerte ?? null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
}
async function updateAutor(id, payload) {
    const fields = Object.keys(payload);
    const values = [];
    const setClauses = fields.map((field, i) => {
        values.push(payload[field]);
        return `${field} = $${i + 1}`;
    });
    values.push(id);
    const query = `
    UPDATE autores
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
}
async function deleteAutor(id) {
    const { rowCount } = await pool.query("DELETE FROM autores WHERE id = $1", [id]);
    return rowCount > 0;
}
module.exports = { listAutores, getAutorById, createAutor, updateAutor, deleteAutor };
