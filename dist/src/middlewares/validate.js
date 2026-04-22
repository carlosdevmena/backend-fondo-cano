"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validate(schema, target = "body") {
    return (req, res, next) => {
        const parsed = schema.safeParse(req[target]);
        if (!parsed.success) {
            return res.status(400).json({
                error: "Validation error",
                details: parsed.error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        const current = req[target];
        if (current && typeof current === "object" && !Array.isArray(current)) {
            Object.keys(current).forEach((key) => {
                delete current[key];
            });
            Object.assign(current, parsed.data);
        }
        else {
            req[target] = parsed.data;
        }
        return next();
    };
}
module.exports = { validate };
