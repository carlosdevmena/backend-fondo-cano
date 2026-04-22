"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");
    if (!token) {
        return res.status(401).json({ error: "Missing bearer token" });
    }
    try {
        const payload = jwt.verify(token, env.jwtAccessSecret);
        req.user = payload;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
function authorize(roles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        return next();
    };
}
module.exports = { authenticate, authorize };
