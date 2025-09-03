const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

// Prueba de conexión a BD
app.get('/db/ping', async (req, res) => {
  try {
    const r = await db.query('SELECT NOW() as now');
    res.json({ db: 'ok', now: r.rows[0].now });
  } catch (e) {
    res.status(500).json({ db: 'error', error: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API en http://localhost:${port}`));
