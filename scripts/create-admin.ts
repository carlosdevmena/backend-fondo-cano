const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
require("dotenv").config();

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    throw new Error("Usage: npm run create-admin -- <email> <password>");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `
      INSERT INTO usuarios_admin (email, password_hash, role, is_active)
      VALUES ($1, $2, 'admin', TRUE)
      ON CONFLICT (email)
      DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = NOW()
    `,
    [email, hash],
  );

  // eslint-disable-next-line no-console
  console.log(`Admin user ready: ${email}`);
  await pool.end();
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
});
