const { pool } = require("../../db/pool");

async function listImagenesByObra(obraId) {
  const query = `
    SELECT *
    FROM imagenes_obra
    WHERE obra_id = $1
    ORDER BY orden ASC, id ASC
  `;
  const { rows } = await pool.query(query, [obraId]);
  return rows;
}

async function getImagenById(id) {
  const { rows } = await pool.query("SELECT * FROM imagenes_obra WHERE id = $1", [id]);
  return rows[0] || null;
}

async function createImagen(payload) {
  const query = `
    INSERT INTO imagenes_obra(obra_id, url, tipo, orden)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [
    payload.obra_id,
    payload.url,
    payload.tipo ?? "principal",
    payload.orden ?? 1,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updateImagen(id, payload) {
  const fields = Object.keys(payload);
  const values = [];
  const setClauses = fields.map((field, i) => {
    values.push(payload[field]);
    return `${field} = $${i + 1}`;
  });
  values.push(id);
  const query = `
    UPDATE imagenes_obra
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function deleteImagen(id) {
  const { rowCount } = await pool.query("DELETE FROM imagenes_obra WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = {
  listImagenesByObra,
  getImagenById,
  createImagen,
  updateImagen,
  deleteImagen,
};
