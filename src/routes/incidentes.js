const router = require('express').Router();
const { pool } = require('../lib/db');
const { auth } = require('../middlewares/auth');

// Listar incidentes
router.get('/', auth(), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM incidentes ORDER BY fecha DESC LIMIT 200');
    res.json(rows);
  } catch (e) { next(e); }
});

// Crear incidente
router.post('/', auth(), async (req, res, next) => {
  try {
    const { envio_id, tipo, descripcion } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO incidentes (envio_id, tipo, descripcion) VALUES ($1,$2,$3) RETURNING *',
      [envio_id, tipo, descripcion]
    );
    await pool.query('UPDATE envios SET estado=$1 WHERE envio_id=$2', ['incidente', envio_id]);
    await pool.query('INSERT INTO historial (envio_id, estado, usuario_id, comentario) VALUES ($1,$2,$3,$4)',
      [envio_id, 'incidente', req.user.usuario_id, descripcion]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// Resolver incidente
router.patch('/:id/resolver', auth(), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resuelto } = req.body;
    const { rows } = await pool.query('UPDATE incidentes SET resuelto = COALESCE($1,true) WHERE incidente_id=$2 RETURNING *', [resuelto, id]);
    if (!rows[0]) return res.status(404).json({ error: 'Incidente no encontrado' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
