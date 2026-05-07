import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UsuarioFormData } from '../components/Usuario/UsuarioForm';

const RegistroForm: React.FC = () => {
  const [formData, setFormData] = useState<UsuarioFormData>({
    nombre_completo: '',
    email: '',
    contrasena: '',
    rol: 'nutricionista',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + (errorData.detail || "No se pudo crear el usuario"));
        return;
      }

      const data = await response.json();
      alert("Usuario creado exitosamente: " + data.email);
      navigate("/");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error de red o del servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow w-100">
      <h3 className="text-center mb-4">Registro de Usuario</h3>

      <div className="mb-3">
        <label>Nombre completo</label>
        <input
          type="text"
          name="nombre_completo"
          className="form-control"
          value={formData.nombre_completo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Correo electrónico</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Contraseña</label>
        <input
          type="password"
          name="contrasena"
          className="form-control"
          value={formData.contrasena}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Rol</label>
        <select
          name="rol"
          className="form-select"
          value={formData.rol}
          onChange={handleChange}
          required
        >
          <option value="nutricionista">Nutricionista</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <button type="submit" className="btn btn-success w-100">
        Registrarse
      </button>
    </form>
  );
};

export default RegistroForm;
