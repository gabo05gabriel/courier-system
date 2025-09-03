import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">CBE</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">Iniciar sesión</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
