const { pool } = require("../../db/pool");

async function listTecnicas() {
  const { rows } = await pool.query("SELECT * FROM tecnicas ORDER BY nombre ASC");
  return rows;
}

async function getTecnicaById(id) {
  const { rows } = await pool.query("SELECT * FROM tecnicas WHERE id = $1", [id]);
  return rows[0] || null;
}

async function createTecnica(payload) {
  const query = `
    INSERT INTO tecnicas(nombre, descripcion)
    VALUES($1, $2)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [payload.nombre, payload.descripcion ?? null]);
  return rows[0];
}

async function updateTecnica(id, payload) {
  const fields = Object.keys(payload);
  const values = [];
  const setClauses = fields.map((field, i) => {
    values.push(payload[field]);
    return `${field} = $${i + 1}`;
  });
  values.push(id);
  const query = `
    UPDATE tecnicas
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function deleteTecnica(id) {
  const { rowCount } = await pool.query("DELETE FROM tecnicas WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = { listTecnicas, getTecnicaById, createTecnica, updateTecnica, deleteTecnica };
