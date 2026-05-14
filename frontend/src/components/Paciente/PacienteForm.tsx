import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Paciente } from '../../types';
import { Save, XCircle, User, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    setError(null);

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
    } catch (err: any) {
      console.error("Error al guardar:", err);
      setError("Ocurrió un error al guardar los datos del paciente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3 border-0" role="alert">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* SECCIÓN 1: DATOS PERSONALES */}
      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <User size={20} /> Datos Personales
      </h5>
      <div className="row g-3 mb-5">
        <div className="col-md-12">
          <label className="form-label text-muted small fw-medium mb-1">Nombre Completo</label>
          <input
            type="text"
            name="nombre_completo"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.nombre_completo}
            onChange={handleChange}
            required
            placeholder="Ej. Juan Pérez"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Edad</label>
          <input
            type="text"
            name="edad"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.edad}
            onChange={handleChange}
            required
            placeholder="Años"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Sexo</label>
          <select
            name="sexo"
            className="form-select bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.sexo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.telefono}
            onChange={handleChange}
            required
            placeholder="Número de contacto"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.direccion}
            onChange={handleChange}
            required
            placeholder="Dirección residencial"
          />
        </div>
      </div>

      {/* SECCIÓN 2: DATOS ANTROPOMÉTRICOS */}
      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Activity size={20} /> Medidas Antropométricas
      </h5>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Peso Actual (kg)</label>
          <input
            type="text"
            name="peso_actual"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.peso_actual}
            onChange={handleChange}
            required
            placeholder="0.0"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Peso Usual (kg)</label>
          <input
            type="text"
            name="peso_usual"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.peso_usual}
            onChange={handleChange}
            required
            placeholder="0.0"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label text-muted small fw-medium mb-1">Talla (cm)</label>
          <input
            type="text"
            name="talla"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.talla}
            onChange={handleChange}
            required
            placeholder="0"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label text-muted small fw-medium mb-1">Cintura (cm)</label>
          <input
            type="text"
            name="circunferencia_cintura"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.circunferencia_cintura}
            onChange={handleChange}
            required
            placeholder="0"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label text-muted small fw-medium mb-1">Índice de Masa Corporal</label>
          <input
            type="text"
            name="ind_masa_corporal"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.ind_masa_corporal}
            onChange={handleChange}
            required
            placeholder="0.0"
          />
        </div>
      </div>

      {/* CLASIFICACIONES SOLO VISIBLES */}
      {paciente && (
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label text-muted small fw-medium mb-1">Clasificación IMC</label>
            <input
              type="text"
              className="form-control border-0"
              style={{ backgroundColor: '#f3f4f6' }}
              value={paciente.clasificacion_imc || 'No disponible'}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-medium mb-1">Clasificación Cintura</label>
            <input
              type="text"
              className="form-control border-0"
              style={{ backgroundColor: '#f3f4f6' }}
              value={paciente.clasificacion_circunferencia || 'No disponible'}
              disabled
            />
          </div>
        </div>
      )}

      {/* BOTONES */}
      <div className="d-flex flex-column flex-md-row gap-3 mt-5 pt-3 border-top">
        <button 
          type="button" 
          className="btn btn-light text-muted d-flex align-items-center justify-content-center gap-2 py-2 px-4" 
          onClick={() => navigate(paciente?.id ? `/pacientes/ver/${paciente.id}` : '/pacientes')}
          disabled={isSubmitting}
        >
          <XCircle size={20} /> Cancelar
        </button>
        <button 
          type="submit" 
          className="btn d-flex align-items-center justify-content-center gap-2 py-2 px-4 ms-md-auto" 
          style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: 500 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <Save size={20} />
          )}
          <span>Guardar Paciente</span>
        </button>
      </div>
    </form>
  );
};

export default PacienteForm;
