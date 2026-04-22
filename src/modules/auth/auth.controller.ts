const authService = require("./auth.service");

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    const result = await authService.refresh(token);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { login, refresh };
