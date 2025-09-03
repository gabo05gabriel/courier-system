const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { pool } = require("./lib/db");

// rutas
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/usuarios");
const enviosRoutes = require("./routes/envios");
const incidentesRoutes = require("./routes/incidentes");
const pagosRoutes = require("./routes/pagos");
const rutasRoutes = require("./routes/rutas");
const entregasRoutes = require("./routes/entregas");
const historialRoutes = require("./routes/historial");

// middlewares
const { notFound, errorHandler } = require("./middlewares/errors");

const app = express();

// ✅ configuración CORS (para Vite en desarrollo)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// health check
app.get("/health", (_, res) => res.json({ ok: true }));

// 👉 rutas de API
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/envios", enviosRoutes);
app.use("/api/incidentes", incidentesRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/rutas", rutasRoutes);
app.use("/api/entregas", entregasRoutes);
app.use("/api/historial", historialRoutes);

// 👉 servir frontend de React (SOLO en producción)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../courier-web/dist");
  app.use(express.static(frontendPath));

  // catch-all: cualquier ruta no-API la maneja React Router
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// middlewares de errores (SIEMPRE al final 👇)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

pool.connect()
  .then((c) => {
    c.release();
    console.log("✅ Conectado a PostgreSQL");
    app.listen(PORT, () => {
      console.log(`🚀 API lista en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a PostgreSQL:", err.message);
    process.exit(1);
  });
