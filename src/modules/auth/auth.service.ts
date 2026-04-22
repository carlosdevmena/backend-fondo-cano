const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const { httpError } = require("../../utils/http-error");
const { findAdminByEmail, updateRefreshTokenHash } = require("./auth.repository");

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessTtl },
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "refresh",
    },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshTtl },
  );
}

async function login(email, password) {
  const admin = await findAdminByEmail(email);

  if (!admin || !admin.is_active) {
    throw httpError(401, "Invalid credentials");
  }

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) {
    throw httpError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken(admin);
  const refreshToken = signRefreshToken(admin);
  // Guardamos el refresh hasheado por seguridad: si se filtra la BD, no queda el token plano.
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await updateRefreshTokenHash(admin.id, refreshTokenHash);

  return {
    accessToken,
    refreshToken,
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch (_error) {
    throw httpError(401, "Invalid refresh token");
  }

  if (payload.type !== "refresh") {
    throw httpError(401, "Invalid refresh token");
  }

  // Se valida por email y hash para poder revocar sesiones al reemplazar refresh_token_hash.
  const admin = await findAdminByEmail(payload.email || "");
  if (!admin || !admin.refresh_token_hash) {
    throw httpError(401, "Refresh token not recognized");
  }

  const validHash = await bcrypt.compare(refreshToken, admin.refresh_token_hash);
  if (!validHash) {
    throw httpError(401, "Refresh token not recognized");
  }

  const accessToken = signAccessToken(admin);

  return { accessToken };
}

module.exports = { login, refresh };
