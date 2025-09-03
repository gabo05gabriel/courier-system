require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Client } = require("pg");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@admin.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_ROLE = "admin";

(async () => {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "courier_db",
    port: Number(process.env.DB_PORT) || 5432,
    ssl: false,
  });

  await client.connect();

  // asegúrate que la tabla users exista (por si no corriste migraciones)
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  const { rows } = await client.query("SELECT id FROM users WHERE email=$1", [ADMIN_EMAIL]);
  if (rows.length) {
    console.log(" Admin ya existe:", ADMIN_EMAIL);
  } else {
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
    await client.query(
      "INSERT INTO users(email, password_hash, role) VALUES ($1,$2,$3)",
      [ADMIN_EMAIL, hash, ADMIN_ROLE]
    );
    console.log(" Admin creado:", ADMIN_EMAIL);
  }

  await client.end();
})();
