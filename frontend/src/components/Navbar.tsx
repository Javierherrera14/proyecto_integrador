import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <Link className="navbar-brand" to="/">Inicio</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item"><Link className="nav-link" to="/usuarios">Usuarios</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/pacientes">Pacientes</Link></li>
          {/* Puedes agregar más enlaces aquí */}
        </ul>
      </div>
    </nav>
  );
}
