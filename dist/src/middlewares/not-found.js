"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function notFound(req, res) {
    return res.status(404).json({
        error: "Route not found",
    });
}
module.exports = { notFound };
