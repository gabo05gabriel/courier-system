require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Client } = require("pg");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@admin.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

(async () => {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "courier_db",
    port: Number(process.env.DB_PORT) || 5432,
  });

  await client.connect();

  // Asegura roles y admin
  await client.query(`INSERT INTO roles(nombre) VALUES ('admin') ON CONFLICT (nombre) DO NOTHING;`);
  const { rows: roleRows } = await client.query(`SELECT rol_id FROM roles WHERE nombre='admin' LIMIT 1;`);
  const adminRolId = roleRows[0].rol_id;

  await client.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      usuario_id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      telefono VARCHAR(20),
      contrasena VARCHAR(255) NOT NULL,
      rol_id INT NOT NULL REFERENCES roles(rol_id)
    );
  `);

  const { rows } = await client.query(`SELECT usuario_id FROM usuarios WHERE email=$1`, [ADMIN_EMAIL]);
  if (rows.length) {
    console.log("✔ Admin ya existe en 'usuarios':", ADMIN_EMAIL);
  } else {
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
    await client.query(
      `INSERT INTO usuarios(nombre, email, telefono, contrasena, rol_id)
       VALUES ($1,$2,$3,$4,$5)`,
      ['Administrador', ADMIN_EMAIL, null, hash, adminRolId]
    );
    console.log("✅ Admin creado en 'usuarios':", ADMIN_EMAIL);
  }

  await client.end();
})();
