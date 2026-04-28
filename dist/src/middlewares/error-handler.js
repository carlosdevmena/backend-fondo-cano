"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    const isPgInvalidText = err?.code === "22P02";
    const status = isPgInvalidText ? 400 : (err.status || 500);
    const message = isPgInvalidText
        ? "Invalid numeric parameter"
        : (err.message || "Internal server error");
    const details = err.details || undefined;
    if (status >= 500) {
        req.log?.error({ err }, "Unhandled server error");
    }
    return res.status(status).json({
        error: message,
        details,
    });
}
module.exports = { errorHandler };
