const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'courier_db',
  port: Number(process.env.DB_PORT) || 5432,
  ssl: false,
});

module.exports = pool;
