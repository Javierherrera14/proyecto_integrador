import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { HerramientaMustCreate } from "../../types";
import { Save, XCircle, Calculator, HeartPulse, Activity, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  initialData?: HerramientaMustCreate;
  onSubmit: (data: HerramientaMustCreate) => Promise<void>;
  pacienteId: number;
}

const HerramientaMustForm: React.FC<Props> = ({ initialData, onSubmit, pacienteId }) => {
  const navigate = useNavigate();

  const initialFormState: HerramientaMustCreate = initialData || {
    id_paciente: 0,
    imc: 0,
    puntaje_imc: 0,
    perdida_peso_porcentaje: 0,
    puntaje_perdida_peso: 0,
    efecto_enfermedad: false,
    puntaje_efecto_enfermedad: 0,
    puntaje_total: 0,
    clasificacion_riesgo: "",
    recomendaciones: "",
  };

  const [formData, setFormData] = useState<HerramientaMustCreate>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    let parsedValue: any;

    if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (
      type === "number" ||
      name.includes("puntaje") ||
      name === "imc" ||
      name === "perdida_peso_porcentaje"
    ) {
      parsedValue = value === "" ? 0 : parseFloat(value);
    } else {
      parsedValue = value;
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      console.error(err);
      setError("Ocurrió un error al guardar la evaluación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/pacientes/ver/${pacienteId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3 border-0" role="alert">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* BLOQUE 1: IMC */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Calculator size={18} /> Paso 1: Índice de Masa Corporal (IMC)
      </h6>
      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">IMC (kg/m²)</label>
          <input
            type="number"
            step="0.01"
            name="imc"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.imc}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Puntaje IMC</label>
          <select
            name="puntaje_imc"
            className="form-select bg-light focus-ring focus-ring-primary border-0 fw-bold"
            style={{ boxShadow: 'none' }}
            value={formData.puntaje_imc}
            onChange={handleChange}
          >
            <option value={0}>0 (IMC &gt; 20.0)</option>
            <option value={1}>1 (IMC 18.5 - 20.0)</option>
            <option value={2}>2 (IMC &lt; 18.5)</option>
          </select>
        </div>
      </div>

      {/* BLOQUE 2: PÉRDIDA DE PESO */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Activity size={18} /> Paso 2: Pérdida de Peso Reciente
      </h6>
      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">% Pérdida de Peso Involuntaria</label>
          <input
            type="number"
            step="0.01"
            name="perdida_peso_porcentaje"
            className="form-control bg-light focus-ring focus-ring-primary border-0"
            style={{ boxShadow: 'none' }}
            value={formData.perdida_peso_porcentaje}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Puntaje Pérdida de Peso</label>
          <select
            name="puntaje_perdida_peso"
            className="form-select bg-light focus-ring focus-ring-primary border-0 fw-bold"
            style={{ boxShadow: 'none' }}
            value={formData.puntaje_perdida_peso}
            onChange={handleChange}
          >
            <option value={0}>0 (&lt; 5%)</option>
            <option value={1}>1 (5% - 10%)</option>
            <option value={2}>2 (&gt; 10%)</option>
          </select>
        </div>
      </div>

      {/* BLOQUE 3: ENFERMEDAD AGUDA */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <HeartPulse size={18} /> Paso 3: Efecto de la Enfermedad Aguda
      </h6>
      <div className="row g-3 mb-5 align-items-center">
        <div className="col-md-6">
          <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
            <input
              type="checkbox"
              className="form-check-input m-0"
              style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              name="efecto_enfermedad"
              checked={formData.efecto_enfermedad}
              onChange={handleChange}
            />
            <label className="form-check-label text-muted small fw-medium m-0">
              ¿Paciente gravemente enfermo sin aporte nutricional &gt; 5 días?
            </label>
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Puntaje Enfermedad Aguda</label>
          <select
            name="puntaje_efecto_enfermedad"
            className="form-select bg-light focus-ring focus-ring-primary border-0 fw-bold"
            style={{ boxShadow: 'none' }}
            value={formData.puntaje_efecto_enfermedad}
            onChange={handleChange}
          >
            <option value={0}>0 (No aplica)</option>
            <option value={2}>2 (Aplica)</option>
          </select>
        </div>
      </div>

      {/* BLOQUE 4: RESULTADO */}
      <div className="p-4 rounded-4 bg-light mb-4 border">
        <h6 className="fw-bold mb-3 text-dark">Riesgo Global y Recomendaciones</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label text-muted small fw-medium mb-1">Puntaje Total MUST</label>
            <select
              name="puntaje_total"
              className="form-select border-0 fw-bold bg-white"
              style={{ boxShadow: 'none' }}
              value={formData.puntaje_total}
              onChange={handleChange}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label text-muted small fw-medium mb-1">Clasificación del Riesgo</label>
            <input
              type="text"
              name="clasificacion_riesgo"
              className="form-control border-0 bg-white"
              style={{ boxShadow: 'none' }}
              value={formData.clasificacion_riesgo}
              onChange={handleChange}
              placeholder="Ej. Riesgo Bajo / Medio / Alto"
            />
          </div>
          <div className="col-md-12 mt-3">
            <label className="form-label text-muted small fw-medium mb-1">Recomendaciones Nutricionales</label>
            <textarea
              rows={3}
              name="recomendaciones"
              className="form-control border-0 bg-white"
              style={{ boxShadow: 'none', resize: 'none' }}
              value={formData.recomendaciones}
              onChange={handleChange}
              placeholder="Indica las pautas a seguir según el riesgo..."
            />
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <div className="d-flex flex-column flex-md-row gap-3 mt-4 pt-3 border-top">
        <button 
          type="button" 
          className="btn btn-light text-muted d-flex align-items-center justify-content-center gap-2 py-2 px-4" 
          onClick={handleCancel}
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
          <span>Guardar Evaluación</span>
        </button>
      </div>
    </form>
  );
};

export default HerramientaMustForm;
