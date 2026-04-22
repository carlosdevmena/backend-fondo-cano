const { pool } = require("../../db/pool");

function mapOrderBy(sortBy) {
  const safeSort = {
    anio: "o.anio",
    titulo: "o.titulo",
    fecha_registro: "o.fecha_registro",
  };
  return safeSort[sortBy] || "o.titulo";
}

async function listObras(filters) {
  const values = [];
  const where = [];
  let idx = 1;

  // Armamos filtros dinámicos con parámetros para evitar SQL injection.
  if (filters.q) {
    where.push(`(o.titulo ILIKE $${idx} OR COALESCE(o.notas, '') ILIKE $${idx})`);
    values.push(`%${filters.q}%`);
    idx += 1;
  }
  if (filters.autorId) {
    where.push(`o.autor_id = $${idx}`);
    values.push(filters.autorId);
    idx += 1;
  }
  if (filters.tecnicaId) {
    where.push(`o.tecnica_id = $${idx}`);
    values.push(filters.tecnicaId);
    idx += 1;
  }
  if (filters.anioDesde) {
    where.push(`o.anio >= $${idx}`);
    values.push(filters.anioDesde);
    idx += 1;
  }
  if (filters.anioHasta) {
    where.push(`o.anio <= $${idx}`);
    values.push(filters.anioHasta);
    idx += 1;
  }
  if (filters.soloConImagen === true) {
    where.push("EXISTS (SELECT 1 FROM imagenes_obra io WHERE io.obra_id = o.id)");
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  const offset = (filters.page - 1) * filters.limit;
  const orderBy = mapOrderBy(filters.sortBy);
  const order = filters.sortOrder === "desc" ? "DESC" : "ASC";

  const countQuery = `SELECT COUNT(*)::int AS total FROM obras o ${whereClause}`;
  const { rows: countRows } = await pool.query(countQuery, values);

  const dataQuery = `
    SELECT
      o.*,
      a.nombre AS autor_nombre,
      t.nombre AS tecnica_nombre,
      (
        SELECT json_agg(json_build_object(
          'id', io.id,
          'url', io.url,
          'tipo', io.tipo,
          'orden', io.orden
        ) ORDER BY io.orden ASC)
        FROM imagenes_obra io
        WHERE io.obra_id = o.id
      ) AS imagenes
    FROM obras o
    LEFT JOIN autores a ON a.id = o.autor_id
    LEFT JOIN tecnicas t ON t.id = o.tecnica_id
    ${whereClause}
    ORDER BY ${orderBy} ${order}
    LIMIT $${idx} OFFSET $${idx + 1}
  `;

  const dataValues = [...values, filters.limit, offset];
  const { rows } = await pool.query(dataQuery, dataValues);

  return {
    data: rows,
    total: countRows[0].total,
    page: filters.page,
    limit: filters.limit,
  };
}

async function getObraById(id) {
  const query = `
    SELECT
      o.*,
      a.nombre AS autor_nombre,
      t.nombre AS tecnica_nombre,
      (
        SELECT json_agg(json_build_object(
          'id', io.id,
          'url', io.url,
          'tipo', io.tipo,
          'orden', io.orden
        ) ORDER BY io.orden ASC)
        FROM imagenes_obra io
        WHERE io.obra_id = o.id
      ) AS imagenes
    FROM obras o
    LEFT JOIN autores a ON a.id = o.autor_id
    LEFT JOIN tecnicas t ON t.id = o.tecnica_id
    WHERE o.id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function createObra(payload) {
  const query = `
    INSERT INTO obras (
      id, titulo, autor_id, tecnica_id, tecnica_detalle,
      anio, anio_es_aproximado, dim_int_ancho_cm, dim_int_alto_cm,
      dim_ext_ancho_cm, dim_ext_alto_cm, unidades, avaluo_cop, notas
    ) VALUES (
      $1,$2,$3,$4,$5,
      $6,$7,$8,$9,
      $10,$11,$12,$13,$14
    )
    RETURNING *
  `;
  const values = [
    payload.id,
    payload.titulo,
    payload.autor_id ?? null,
    payload.tecnica_id ?? null,
    payload.tecnica_detalle ?? null,
    payload.anio ?? null,
    payload.anio_es_aproximado ?? false,
    payload.dim_int_ancho_cm ?? null,
    payload.dim_int_alto_cm ?? null,
    payload.dim_ext_ancho_cm ?? null,
    payload.dim_ext_alto_cm ?? null,
    payload.unidades ?? 1,
    payload.avaluo_cop ?? null,
    payload.notas ?? null,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updateObra(id, payload) {
  const fields = Object.keys(payload);
  if (fields.length === 0) {
    return getObraById(id);
  }

  const sets = [];
  const values = [];

  fields.forEach((field, i) => {
    sets.push(`${field} = $${i + 1}`);
    values.push(payload[field]);
  });

  values.push(id);
  const query = `
    UPDATE obras
    SET ${sets.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function deleteObra(id) {
  const { rowCount } = await pool.query("DELETE FROM obras WHERE id = $1", [id]);
  return rowCount > 0;
}

async function getFacets() {
  const query = `
    SELECT
      'tecnica' AS facet,
      COALESCE(t.nombre, 'Sin técnica') AS value,
      COUNT(*)::int AS count
    FROM obras o
    LEFT JOIN tecnicas t ON t.id = o.tecnica_id
    GROUP BY COALESCE(t.nombre, 'Sin técnica')
    UNION ALL
    SELECT
      'autor' AS facet,
      COALESCE(a.nombre, 'Sin autor') AS value,
      COUNT(*)::int AS count
    FROM obras o
    LEFT JOIN autores a ON a.id = o.autor_id
    GROUP BY COALESCE(a.nombre, 'Sin autor')
    UNION ALL
    SELECT
      'decada' AS facet,
      CASE WHEN o.anio IS NULL THEN 'Sin año'
      ELSE CONCAT((o.anio / 10) * 10, 's')
      END AS value,
      COUNT(*)::int AS count
    FROM obras o
    GROUP BY CASE WHEN o.anio IS NULL THEN 'Sin año'
      ELSE CONCAT((o.anio / 10) * 10, 's')
      END
    ORDER BY facet, count DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

module.exports = {
  listObras,
  getObraById,
  createObra,
  updateObra,
  deleteObra,
  getFacets,
};
