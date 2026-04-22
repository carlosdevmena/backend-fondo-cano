"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { z } = require("zod");
const autorPayloadSchema = z.object({
    nombre: z.string().min(1).max(255),
    biografia: z.string().nullable().optional(),
    fecha_nac: z.int().nullable().optional(),
    fecha_muerte: z.int().nullable().optional(),
});
const autorPatchSchema = autorPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, { message: "Patch payload must include at least one field" });
module.exports = { autorPayloadSchema, autorPatchSchema };
