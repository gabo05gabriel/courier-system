import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nuevo, setNuevo] = useState({ nombre: "", email: "", contrasena: "", rol_id: 2 });

  // cargar usuarios al montar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    setLoading(true);
    setError("");
    try {
      const data = await api.request("/api/usuarios", { method: "GET" });
      setUsuarios(data);
    } catch (err) {
      setError(err.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function crearUsuario(e) {
    e.preventDefault();
    try {
      await api.request("/api/usuarios", {
        method: "POST",
        body: nuevo,
      });
      setNuevo({ nombre: "", email: "", contrasena: "", rol_id: 2 });
      cargarUsuarios();
    } catch (err) {
      setError(err.message || "Error creando usuario");
    }
  }

  async function eliminarUsuario(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await api.request(`/api/usuarios/${id}`, { method: "DELETE" });
      cargarUsuarios();
    } catch (err) {
      setError(err.message || "Error eliminando usuario");
    }
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">Gestión de Usuarios</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-3 mb-4 shadow-sm">
        <h5>Nuevo usuario</h5>
        <form onSubmit={crearUsuario} className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="Correo"
              value={nuevo.email}
              onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={nuevo.contrasena}
              onChange={(e) => setNuevo({ ...nuevo, contrasena: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={nuevo.rol_id}
              onChange={(e) => setNuevo({ ...nuevo, rol_id: parseInt(e.target.value) })}
            >
              <option value={2}>Usuario</option>
              <option value={3}>Administrador</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-dark w-100">Crear</button>
          </div>
        </form>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.usuario_id}>
                  <td>{u.usuario_id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.rol || u.rol_nombre}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarUsuario(u.usuario_id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
