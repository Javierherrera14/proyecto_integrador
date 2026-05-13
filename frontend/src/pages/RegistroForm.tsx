import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UsuarioFormData } from '../components/Usuario/UsuarioForm';

const RegistroForm: React.FC = () => {
  const [formData, setFormData] = useState<UsuarioFormData>({
    nombre_completo: '',
    email: '',
    contrasena: '',
    rol: 'nutricionista',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "No se pudo crear el usuario");
      }

      const data = await response.json();
      setSuccess("¡Usuario creado exitosamente!");
      
      // Esperar un momento para que el usuario lea el mensaje antes de redirigir
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (err: any) {
      console.error("Error al crear usuario:", err);
      setError(err.message || "Error de red o del servidor al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="p-5 bg-white rounded-4 shadow-lg" style={{ width: '100%', maxWidth: '450px', border: '1px solid var(--color-border)' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3" style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <Activity size={32} />
          </div>
          <h3 className="fw-bold" style={{ color: 'var(--color-text-main)' }}>Crear Cuenta</h3>
          <p className="text-muted">Únete a NutriSystem</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert" style={{ fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center gap-2" role="alert" style={{ fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={18} />
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted fw-medium small mb-1">Nombre completo</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <User size={18} className="text-muted" />
              </span>
              <input
                type="text"
                name="nombre_completo"
                className="form-control border-start-0 ps-0 bg-light"
                style={{ boxShadow: 'none' }}
                placeholder="Dr. Juan Pérez"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                disabled={isLoading || !!success}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted fw-medium small mb-1">Correo electrónico</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Mail size={18} className="text-muted" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control border-start-0 ps-0 bg-light"
                style={{ boxShadow: 'none' }}
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading || !!success}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted fw-medium small mb-1">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Lock size={18} className="text-muted" />
              </span>
              <input
                type="password"
                name="contrasena"
                className="form-control border-start-0 ps-0 bg-light"
                style={{ boxShadow: 'none' }}
                placeholder="••••••••"
                value={formData.contrasena}
                onChange={handleChange}
                required
                disabled={isLoading || !!success}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted fw-medium small mb-1">Rol</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <ShieldCheck size={18} className="text-muted" />
              </span>
              <select
                name="rol"
                className="form-select border-start-0 ps-0 bg-light"
                style={{ boxShadow: 'none' }}
                value={formData.rol}
                onChange={handleChange}
                required
                disabled={isLoading || !!success}
              >
                <option value="nutricionista">Nutricionista</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn w-100 d-flex justify-content-center align-items-center gap-2 py-2" 
            style={{ backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 500 }}
            disabled={isLoading || !!success}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <span>Registrarse</span>
            )}
          </button>

          <p className="mt-4 text-center text-muted small">
            ¿Ya tienes cuenta? <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Inicia Sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistroForm;
