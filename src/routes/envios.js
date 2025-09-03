const router = require('express').Router();
const { pool } = require('../lib/db');
const { auth } = require('../middlewares/auth');

// GET /api/historial/envio/:id  -> historial_envios
router.get('/envio/:id', auth(), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT evento_id, envio_id, tipo_evento, fecha_evento, ubicacion_latitud, ubicacion_longitud
       FROM historial_envios
       WHERE envio_id=$1
       ORDER BY fecha_evento ASC`,
      [id]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
