"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { z } = require("zod");
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(120),
});
const refreshSchema = z.object({
    refreshToken: z.string().min(20).optional(),
});
module.exports = { loginSchema, refreshSchema };
