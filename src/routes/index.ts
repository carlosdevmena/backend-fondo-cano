const { Router } = require("express");
const { authRouter } = require("../modules/auth/auth.routes");
const { obrasRouter } = require("../modules/obras/obras.routes");
const { autoresRouter } = require("../modules/autores/autores.routes");
const { tecnicasRouter } = require("../modules/tecnicas/tecnicas.routes");
const { imagenesRouter } = require("../modules/imagenes/imagenes.routes");

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/obras", obrasRouter);
apiRouter.use("/autores", autoresRouter);
apiRouter.use("/tecnicas", tecnicasRouter);
apiRouter.use("/imagenes", imagenesRouter);

module.exports = { apiRouter };
