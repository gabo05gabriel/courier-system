const router = require('express').Router();
const { pool } = require('../lib/db');
const { auth } = require('../middlewares/auth');

// Registrar pago
router.post('/', auth(), async (req, res, next) => {
  try {
    const { envio_id, monto, metodo } = req.body;
    const { rows } = await pool.query('INSERT INTO pagos (envio_id, monto, metodo) VALUES ($1,$2,$3) RETURNING *', [envio_id, monto, metodo]);
    await pool.query('UPDATE envios SET pagado=true WHERE envio_id=$1', [envio_id]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// Listar pagos
router.get('/', auth(), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pagos ORDER BY fecha DESC LIMIT 200');
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
