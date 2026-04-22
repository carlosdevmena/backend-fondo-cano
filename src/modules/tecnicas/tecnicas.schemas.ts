const { z } = require("zod");

const tecnicaPayloadSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().nullable().optional(),
});

const tecnicaPatchSchema = tecnicaPayloadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Patch payload must include at least one field" },
);

module.exports = { tecnicaPayloadSchema, tecnicaPatchSchema };
