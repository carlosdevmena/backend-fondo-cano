"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { z } = require("zod");
const imagenPayloadSchema = z.object({
    obra_id: z.string().min(1).max(20),
    url: z.string().url(),
    tipo: z.string().max(50).nullable().optional(),
    orden: z.int().positive().optional(),
});
const imagenPatchSchema = imagenPayloadSchema.partial().refine((data) => Object.keys(data).length > 0, { message: "Patch payload must include at least one field" });
module.exports = { imagenPayloadSchema, imagenPatchSchema };
