import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }

      const data = await response.json();

      // Guardamos todo el usuario
      localStorage.setItem('usuario', JSON.stringify(data));
      // También solo el ID por separado
      localStorage.setItem('usuario_id', data.id.toString());

      navigate('/pacientes'); // redirige a inicio o dashboard
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="p-5 bg-white rounded-4 shadow-lg" style={{ width: '100%', maxWidth: '420px', border: '1px solid var(--color-border)' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3" style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <Activity size={32} />
          </div>
          <h3 className="fw-bold" style={{ color: 'var(--color-text-main)' }}>Bienvenido</h3>
          <p className="text-muted">Ingresa a NutriSystem</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert" style={{ fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-muted fw-medium small mb-1">Correo electrónico</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Mail size={18} className="text-muted" />
              </span>
              <input
                type="email"
                className="form-control border-start-0 ps-0 bg-light"
                style={{ boxShadow: 'none' }}
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted fw-medium small mb-1">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Lock size={18} className="text-muted" />
              </span>
              <input
                type="password"
                className="form-control border-start-0 ps-0 bg-light"
                style={{ boxShadow: 'none' }}
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn w-100 d-flex justify-content-center align-items-center gap-2 py-2" 
            style={{ backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 500 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <LogIn size={20} />
            )}
            <span>{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
          </button>

          <p className="mt-4 text-center text-muted small">
            ¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
