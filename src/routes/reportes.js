const express = require("express");
const router = express.Router();
const { pool } = require("../lib/db");

// Endpoint de envíos
router.get("/envios", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id_envio,
        cliente_nombre,
        destino,
        estado,
        fecha,
        monto
      FROM envios
      ORDER BY fecha DESC
      LIMIT 50;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error en /api/reportes/envios:", err);
    res.status(500).json({ error: "Error cargando envíos" });
  }
});

module.exports = router;
