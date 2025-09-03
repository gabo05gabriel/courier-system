const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../lib/db');
const { auth } = require('../middlewares/auth');

// GET lista
router.get('/', auth('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT usuario_id, nombre, email, telefono, rol_id, activo, created_at FROM usuarios ORDER BY usuario_id DESC');
    res.json(rows);
  } catch (e) { next(e); }
});

// POST crear
router.post('/', auth('admin'), async (req, res, next) => {
  try {
    const { nombre, email, telefono, contrasena, rol_id } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nombre, email, telefono, contrasena, rol_id) VALUES ($1,$2,$3,$4,$5) RETURNING usuario_id, nombre, email, telefono, rol_id, activo, created_at',
      [nombre, email, telefono, hash, rol_id || 2]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// PUT actualizar
router.put('/:id', auth('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, rol_id, activo } = req.body;
    const { rows } = await pool.query(
      'UPDATE usuarios SET nombre=COALESCE($1,nombre), telefono=COALESCE($2,telefono), rol_id=COALESCE($3,rol_id), activo=COALESCE($4,activo) WHERE usuario_id=$5 RETURNING usuario_id, nombre, email, telefono, rol_id, activo, created_at',
      [nombre, telefono, rol_id, activo, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// DELETE (soft)
router.delete('/:id', auth('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('UPDATE usuarios SET activo=false WHERE usuario_id=$1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
