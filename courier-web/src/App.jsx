// src/App.jsx
import { Routes, Route } from "react-router-dom";

// Páginas principales
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

// Layout del panel
import Panel from "./pages/Panel.jsx";

// Subpáginas del Panel
import Dashboard from "./pages/Dashboard.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Envios from "./pages/Envios.jsx";

export default function App() {
  return (
    <Routes>
      {/* Rutas principales */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Panel con subrutas */}
      <Route path="/panel" element={<Panel />}>
        {/* Página por defecto al entrar a /panel */}
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="envios" element={<Envios />} /> {/* Página real de Envíos */}
        <Route path="rutas" element={<div>🚚 Gestión de rutas</div>} />
        <Route path="pagos" element={<div>💳 Pagos</div>} />
        <Route path="historial" element={<div>🕓 Historial de envíos</div>} />
        <Route path="reportes" element={<div>📑 Reportes</div>} />
      </Route>

      {/* 404 app-level */}
      <Route
        path="*"
        element={<div className="p-4">Página no encontrada</div>}
      />
    </Routes>
  );
}
