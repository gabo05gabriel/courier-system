const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../lib/db');
const { auth } = require('../middlewares/auth');

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, contrasena, password } = req.body;
    const pass = contrasena || password; // aceptar ambos nombres

    if (!email || !pass) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // buscar usuario
    const { rows } = await pool.query(
      `SELECT u.*, r.nombre AS rol_nombre
       FROM usuarios u
       LEFT JOIN roles r ON r.rol_id = u.rol_id
       WHERE u.email = $1
       LIMIT 1`,
      [email]
    );

    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    let ok = false;

    // soportar bcrypt o texto plano
    if (user.contrasena.startsWith('$2b$')) {
      ok = await bcrypt.compare(pass, user.contrasena);
    } else {
      ok = pass === user.contrasena;
    }

    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    // generar JWT
    const token = jwt.sign(
      {
        usuario_id: user.usuario_id,
        email: user.email,
        nombre: user.nombre,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre || null
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        usuario_id: user.usuario_id,
        email: user.email,
        nombre: user.nombre,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre || null
      }
    });
  } catch (e) { next(e); }
});

// GET /api/auth/me
router.get('/me', auth(), async (req, res) => {
  res.json({ me: req.user });
});

module.exports = router;
