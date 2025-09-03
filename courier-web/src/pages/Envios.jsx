// FRONTEND — src/pages/Envios.jsx
import React from "react";
import MapRutas from "../components/MapRutas"; // importa tu componente del mapa

export default function Envios() {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: "1rem" }}>📦 Planificación de Rutas</h2>
      
      {/* Aquí renderizas el mapa con las rutas */}
      <MapRutas />

      {/* Sección extra para futuro (ejemplo: lista de envíos o controles) */}
      <div style={{ marginTop: "1rem" }}>
        <p>
          Usa este módulo para visualizar y planificar las rutas de los mensajeros en tiempo real.
        </p>
      </div>
    </div>
  );
}
