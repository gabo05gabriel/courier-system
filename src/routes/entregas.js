const router = require('express').Router();
const { pool } = require('../lib/db');
const { auth } = require('../middlewares/auth');

// Confirmar entrega
router.post('/', auth(), async (req, res, next) => {
  try {
    const { envio_id, recibido_por, observaciones } = req.body;
    const { rows } = await pool.query('INSERT INTO entregas (envio_id, recibido_por, observaciones) VALUES ($1,$2,$3) RETURNING *',
      [envio_id, recibido_por, observaciones]);
    await pool.query('UPDATE envios SET estado=$1 WHERE envio_id=$2', ['entregado', envio_id]);
    await pool.query('INSERT INTO historial (envio_id, estado, usuario_id, comentario) VALUES ($1,$2,$3,$4)',
      [envio_id, 'entregado', req.user.usuario_id, observaciones]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
