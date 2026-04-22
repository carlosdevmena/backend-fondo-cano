"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function httpError(status, message, details = undefined) {
    const error = new Error(message);
    error.status = status;
    error.details = details;
    return error;
}
module.exports = { httpError };
