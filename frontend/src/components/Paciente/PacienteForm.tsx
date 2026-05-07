import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Paciente } from '../../types';

interface PacienteFormProps {
  paciente?: Paciente;
  onSubmit: (data: Partial<Paciente>) => Promise<void>;
}

const initialFormState = {
  nombre_completo: '',
  edad: '',
  sexo: '',
  telefono: '',
  direccion: '',
  peso_actual: '',
  peso_usual: '',
  talla: '',
  circunferencia_cintura: '',
  ind_masa_corporal: ''
};

const PacienteForm: React.FC<PacienteFormProps> = ({ paciente, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paciente) {
      const pacienteParaForm: any = {};
      Object.keys(initialFormState).forEach((key) => {
        pacienteParaForm[key] = (paciente as any)[key] ?? '';
      });
      setFormData(pacienteParaForm);
    } else {
      setFormData(initialFormState);
    }
  }, [paciente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const decimalFields = ['peso_actual', 'peso_usual'];
    const integerFields = ['edad', 'telefono', 'talla', 'circunferencia_cintura', 'ind_masa_corporal'];

    if (decimalFields.includes(name) && !/^\d*\.?\d*$/.test(value)) return;
    if (integerFields.includes(name) && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

      const {
        nombre_completo,
        edad,
        sexo,
        telefono,
        direccion,
        peso_actual,
        peso_usual,
        talla,
        circunferencia_cintura,
        ind_masa_corporal
      } = formData;

      const dataConUsuario: Partial<Paciente> = {
        nombre_completo,
        edad: parseInt(edad) || 0,
        sexo,
        telefono,
        direccion,
        peso_actual: parseFloat(peso_actual) || 0,
        peso_usual: parseFloat(peso_usual) || 0,
        talla: parseInt(talla) || 0,
        circunferencia_cintura: parseInt(circunferencia_cintura) || 0,
        ind_masa_corporal: parseFloat(ind_masa_corporal) || 0,
        usuario_id: parseInt(usuario.id),
      };

      await onSubmit(dataConUsuario);

      setMensaje("✅ Paciente guardado exitosamente");
      setError(null);
      setFormData(initialFormState);

      setTimeout(() => {
        setMensaje(null);
        navigate('/pacientes');
      }, 3000);
    } catch (err: any) {
      console.error("❌ Error al guardar:", err);
      setMensaje(null);
      setError("❌ Error al guardar el paciente.");
    }
  };

  const handleCancelar = () => {
    navigate('/pacientes');
  };

  return (
    <div className="container mt-4">
      <h2 className="bg-dark text-white p-3 rounded text-center">Formulario de Paciente</h2>
      <form onSubmit={handleSubmit}>
        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
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
          <label className="form-label">Edad</label>
          <input
            type="text"
            name="edad"
            className="form-control"
            value={formData.edad}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Sexo</label>
          <select
            name="sexo"
            className="form-control"
            value={formData.sexo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Peso Actual (kg)</label>
          <input
            type="text"
            name="peso_actual"
            className="form-control"
            value={formData.peso_actual}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Peso Usual (kg)</label>
          <input
            type="text"
            name="peso_usual"
            className="form-control"
            value={formData.peso_usual}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Talla (cm)</label>
          <input
            type="text"
            name="talla"
            className="form-control"
            value={formData.talla}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Circunferencia Cintura (cm)</label>
          <input
            type="text"
            name="circunferencia_cintura"
            className="form-control"
            value={formData.circunferencia_cintura}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Índice de Masa Corporal</label>
          <input
            type="text"
            name="ind_masa_corporal"
            className="form-control"
            value={formData.ind_masa_corporal}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campos calculados solo visibles, no enviados */}
        <div className="mb-3">
          <label className="form-label">Clasificación IMC</label>
          <input
            type="text"
            className="form-control"
            value={paciente?.clasificacion_imc || 'No disponible'}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Clasificación Circunferencia</label>
          <input
            type="text"
            className="form-control"
            value={paciente?.clasificacion_circunferencia || 'No disponible'}
            disabled
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary w-100">Guardar Paciente</button>
          <button type="button" className="btn btn-secondary w-100" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default PacienteForm;
