import React, { useState } from 'react';

interface UsuarioFormProps {
  onSubmit: (usuario: UsuarioFormData) => void;
  initialData?: UsuarioFormData | null; // <- aquí está la diferencia
}


export interface UsuarioFormData {
  nombre_completo: string;
  email: string;
  contrasena: string;
  rol: string;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<UsuarioFormData>({
    nombre_completo: initialData?.nombre_completo || '',
    email: initialData?.email || '',
    contrasena: initialData?.contrasena || '',
    rol: initialData?.rol || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow w-100">
      <h3 className="text-center mb-4">Crear Usuario</h3>

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
          <option value="">Selecciona un rol</option>
          <option value="nutricionista">Nutricionista</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Crear
      </button>
    </form>
  );
};

export default UsuarioForm;


