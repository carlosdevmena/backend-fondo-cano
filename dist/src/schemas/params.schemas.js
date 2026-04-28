"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { z } = require("zod");
const positiveIntParam = z.coerce.number().int().positive();
const obraIdParam = z.string().trim().min(1).max(20);
const idParamSchema = z.object({
    id: positiveIntParam,
});
const obraIdParamSchema = z.object({
    obraId: obraIdParam,
});
const obraKeyParamSchema = z.object({
    id: obraIdParam,
});
module.exports = {
    idParamSchema,
    obraIdParamSchema,
    obraKeyParamSchema,
};
