import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="d-flex vh-100 bg-dark text-white justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="fw-bold mb-3">Courier Bolivian Express</h1>
        <p className="text-muted">Sistema de gestión de envíos</p>
        <Link to="/login" className="btn btn-light btn-lg mt-4">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
