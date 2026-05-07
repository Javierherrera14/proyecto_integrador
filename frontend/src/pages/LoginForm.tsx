import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();

      // Guardamos todo el usuario
      localStorage.setItem('usuario', JSON.stringify(data));

      // También solo el ID por separado si quieres
      localStorage.setItem('usuario_id', data.id.toString());

      alert('Login exitoso');
      navigate('/pacientes'); // redirige a inicio o dashboard
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleLogin} className="p-4 bg-white rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>

        <div className="mb-3">
          <label>Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Entrar</button>

        <p className="mt-3 text-center">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

