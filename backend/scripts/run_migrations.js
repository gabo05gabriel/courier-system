const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { Client } = require("pg");

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
  console.log(" conectado a Postgres");

  // tabla de control de migraciones
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  const dir = path.join(__dirname, "..", "migrations");
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith(".sql"))
    .sort(); // corre en orden alfabético: 000_, 001_, 002_...

  for (const file of files) {
    const { rows } = await client.query("SELECT 1 FROM _migrations WHERE filename=$1", [file]);
    if (rows.length) {
      console.log(` ya aplicada: ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    console.log(` aplicando: ${file}`);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO _migrations(filename) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(` aplicada: ${file}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(` error en ${file}:`, err.message);
      process.exit(1);
    }
  }

  await client.end();
  console.log(" migraciones completadas");
})();
