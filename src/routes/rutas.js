const router = require('express').Router();
const { pool } = require('../lib/db');
const { auth } = require('../middlewares/auth');

router.get('/', auth(), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM rutas ORDER BY ruta_id DESC');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', auth('admin'), async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const { rows } = await pool.query('INSERT INTO rutas (nombre, descripcion) VALUES ($1,$2) RETURNING *', [nombre, descripcion]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
