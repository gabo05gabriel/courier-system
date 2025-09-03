const jwt = require('jsonwebtoken');

function auth(requiredRole = null) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      if (requiredRole && payload.rol_nombre !== requiredRole) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}

module.exports = { auth };
