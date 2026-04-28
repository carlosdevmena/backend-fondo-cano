const { z } = require("zod");

const optionalIntQuery = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return value;
}, z.coerce.number().int().optional());

const obraPayloadSchema = z.object({
  id: z.string().min(1).max(20),
  titulo: z.string().min(1),
  autor_id: z.int().nullable().optional(),
  tecnica_id: z.int().nullable().optional(),
  tecnica_detalle: z.string().max(255).nullable().optional(),
  anio: z.int().nullable().optional(),
  anio_es_aproximado: z.boolean().optional(),
  dim_int_ancho_cm: z.coerce.number().nullable().optional(),
  dim_int_alto_cm: z.coerce.number().nullable().optional(),
  dim_ext_ancho_cm: z.coerce.number().nullable().optional(),
  dim_ext_alto_cm: z.coerce.number().nullable().optional(),
  unidades: z.int().positive().optional(),
  avaluo_cop: z.coerce.number().int().nonnegative().nullable().optional(),
  notas: z.string().nullable().optional(),
});

const obraPatchSchema = obraPayloadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Patch payload must include at least one field",
  },
);

const obraQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.string().optional(),
    ),
    // Acepta camelCase y snake_case para compatibilidad con distintos clientes
    autorId: optionalIntQuery,
    autor_id: optionalIntQuery,
    tecnicaId: optionalIntQuery,
    tecnica_id: optionalIntQuery,
    anioDesde: optionalIntQuery,
    anio_desde: optionalIntQuery,
    anioHasta: optionalIntQuery,
    anio_hasta: optionalIntQuery,
    soloConImagen: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.enum(["true", "false"]).optional(),
    ).transform((v) => (v === undefined ? undefined : v === "true")),
    solo_con_imagen: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : v),
      z.enum(["true", "false"]).optional(),
    ).transform((v) => (v === undefined ? undefined : v === "true")),
    sortBy: z.enum(["anio", "titulo", "fecha_registro"]).default("titulo"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  })
  .transform((raw) => ({
    page: raw.page,
    limit: raw.limit,
    q: raw.q,
    autorId: raw.autorId ?? raw.autor_id,
    tecnicaId: raw.tecnicaId ?? raw.tecnica_id,
    anioDesde: raw.anioDesde ?? raw.anio_desde,
    anioHasta: raw.anioHasta ?? raw.anio_hasta,
    soloConImagen: raw.soloConImagen ?? raw.solo_con_imagen,
    sortBy: raw.sortBy,
    sortOrder: raw.sortOrder,
  }));

module.exports = { obraPayloadSchema, obraPatchSchema, obraQuerySchema };
