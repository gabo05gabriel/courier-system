import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("admin@courier.local");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const data = await api.login(email.trim(), password);
      const token = data?.token || data?.access_token || data?.jwt;
      if (!token) throw new Error("Respuesta inválida del servidor");

      localStorage.setItem("token", token);
      navigate("/panel", { replace: true });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex vh-100 bg-dark text-white justify-content-center align-items-center">
      <div className="card p-4 shadow-lg" style={{ minWidth: "350px", maxWidth: "400px" }}>
        <h2 className="text-center mb-3 text-dark">Iniciar sesión</h2>
        <p className="text-center text-muted mb-4">Ingresa con tu correo y contraseña</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-dark">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-dark">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button type="submit" className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-muted mt-3">
          ¿No tienes cuenta? <Link to="/" className="text-primary">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
