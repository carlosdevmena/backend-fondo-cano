"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const obraPatchSchema = obraPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "Patch payload must include at least one field",
});
const obraQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().optional(),
    autorId: optionalIntQuery,
    tecnicaId: optionalIntQuery,
    anioDesde: optionalIntQuery,
    anioHasta: optionalIntQuery,
    soloConImagen: z
        .enum(["true", "false"])
        .optional()
        .transform((value) => (value ? value === "true" : undefined)),
    sortBy: z.enum(["anio", "titulo", "fecha_registro"]).default("titulo"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
module.exports = { obraPayloadSchema, obraPatchSchema, obraQuerySchema };
