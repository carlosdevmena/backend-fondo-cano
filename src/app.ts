const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pinoHttp = require("pino-http");
const { rateLimit } = require("express-rate-limit");
const { env } = require("./config/env");
const { apiRouter } = require("./routes");
const { notFound } = require("./middlewares/not-found");
const { errorHandler } = require("./middlewares/error-handler");

const app = express();

// Logs HTTP básicos. Ocultamos headers sensibles para no filtrar tokens.
app.use(
  pinoHttp({
    redact: ["req.headers.authorization", "req.headers.cookie"],
  }),
);
app.use(helmet());
// En local dejamos origen flexible; en producción se controla por CORS_ORIGIN.
app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(","),
    credentials: true,
  }),
);
// Evita abuso de endpoints públicos y del login.
app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    limit: env.rateLimitMax,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1", apiRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = { app };
