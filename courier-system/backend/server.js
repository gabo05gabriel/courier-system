// Importación de módulos
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Configurar variables de entorno
dotenv.config();

// Inicializar la app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API Courier funcionando correctamente! 🚀');
});

// Ruta para obtener todos los envíos
app.get('/api/envios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM envios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener envíos');
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
