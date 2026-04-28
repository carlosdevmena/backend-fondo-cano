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

    if (target === "query") {
      // Express 5 define `req.query` con getter (solo lectura). Redefinimos en la instancia del request.
      Object.defineProperty(req, "query", {
        value: parsed.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      return next();
    }

    if (target === "params") {
      Object.assign(req.params, parsed.data);
      return next();
    }

    req[target] = parsed.data;
    return next();
  };
}

module.exports = { validate };
