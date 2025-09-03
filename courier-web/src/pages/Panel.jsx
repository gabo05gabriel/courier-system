// src/pages/Panel.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function Panel() {
  return (
    <div className="container py-3">
      <nav className="mb-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <NavLink end to="/panel" className="nav-link">Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/panel/usuarios" className="nav-link">Usuarios</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/panel/envios" className="nav-link">Envíos</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/panel/rutas" className="nav-link">Rutas</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/panel/reportes" className="nav-link">Reportes</NavLink>
          </li>
        </ul>
      </nav>

      {/* MUY IMPORTANTE para que se rendericen las subrutas */}
      <Outlet />
    </div>
  );
}
