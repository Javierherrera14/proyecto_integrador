import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Users, UserSquare2, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const usuarioStr = localStorage.getItem("usuario");
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        if (usuario.rol === "admin") {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const navLinks = [
    { name: "Pacientes", path: "/pacientes", icon: Users },
  ];

  if (isAdmin) {
    navLinks.push({ name: "Usuarios", path: "/usuarios", icon: UserSquare2 });
  }

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuario_id");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 py-3 sticky-top" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/pacientes" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          <Activity size={24} />
          <span>NutriSystem</span>
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <Menu size={24} color="var(--color-text-main)" />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <li className="nav-item" key={link.path}>
                  <Link 
                    className={`nav-link d-flex align-items-center gap-2 px-3 ${isActive ? 'active' : ''}`} 
                    to={link.path}
                    style={{ 
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            {/* Botón de cerrar sesión funcional */}
            <button onClick={handleLogout} className="btn btn-outline-danger d-flex align-items-center gap-2" style={{ borderRadius: 'var(--radius-md)' }}>
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
