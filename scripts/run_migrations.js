const fs = require('fs');
const path = require('path');
const { pool } = require('../src/lib/db');

async function run() {
  const folder = path.join(__dirname, '../db/migrations');
  const files = fs.readdirSync(folder).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(folder, f), 'utf8');
    console.log('▶ Ejecutando', f);
    await pool.query(sql);
    console.log('✔ OK', f);
  }
  await pool.end();
  console.log('✅ Migraciones completadas');
}

run().catch(e => {
  console.error('❌ Error en migraciones:', e);
  process.exit(1);
});
