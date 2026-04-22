const { Router } = require("express");
const obrasController = require("./obras.controller");
const { validate } = require("../../middlewares/validate");
const { authenticate, authorize } = require("../../middlewares/auth");
const { obraPayloadSchema, obraPatchSchema, obraQuerySchema } = require("./obras.schemas");

const obrasRouter = Router();

obrasRouter.get("/", validate(obraQuerySchema, "query"), obrasController.list);
obrasRouter.get("/facets", obrasController.facets);
obrasRouter.get("/:id", obrasController.getById);

obrasRouter.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validate(obraPayloadSchema),
  obrasController.create,
);
obrasRouter.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validate(obraPayloadSchema),
  obrasController.patch,
);
obrasRouter.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validate(obraPatchSchema),
  obrasController.patch,
);
obrasRouter.delete("/:id", authenticate, authorize(["admin"]), obrasController.remove);

module.exports = { obrasRouter };
