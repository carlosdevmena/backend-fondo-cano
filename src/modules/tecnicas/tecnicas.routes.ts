const { Router } = require("express");
const tecnicasController = require("./tecnicas.controller");
const { validate } = require("../../middlewares/validate");
const { authenticate, authorize } = require("../../middlewares/auth");
const { tecnicaPayloadSchema, tecnicaPatchSchema } = require("./tecnicas.schemas");

const tecnicasRouter = Router();

tecnicasRouter.get("/", tecnicasController.list);
tecnicasRouter.get("/:id", tecnicasController.getById);
tecnicasRouter.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validate(tecnicaPayloadSchema),
  tecnicasController.create,
);
tecnicasRouter.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validate(tecnicaPayloadSchema),
  tecnicasController.patch,
);
tecnicasRouter.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validate(tecnicaPatchSchema),
  tecnicasController.patch,
);
tecnicasRouter.delete("/:id", authenticate, authorize(["admin"]), tecnicasController.remove);

module.exports = { tecnicasRouter };
