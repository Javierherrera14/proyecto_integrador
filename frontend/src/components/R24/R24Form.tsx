import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearR24, obtenerR24, actualizarR24 } from "../../services/r24Service";
import type { R24 } from "../../types";
import { Save, XCircle, AlertCircle, Calendar } from "lucide-react";

interface Props {
  idPaciente?: number;
}

const R24Form: React.FC<Props> = ({ idPaciente }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<R24>({
    id_paciente: idPaciente ?? 0,
    fecha: "",
    observaciones: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      obtenerR24(parseInt(id))
        .then((data) => setFormData(data))
        .catch(() => setError("Error al cargar el registro R24"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id_paciente" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (id) {
        await actualizarR24(parseInt(id), formData);
      } else {
        await crearR24(formData);
      }
      navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
    } catch (error) {
      console.error("Error al guardar R24:", error);
      setError("Ocurrió un error al guardar el registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Cargando datos...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3 border-0" role="alert">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Calendar size={18} /> Datos del Recordatorio
      </h6>

      <div className="row g-4 mb-4">
        {!id && !idPaciente && (
          <div className="col-md-6">
            <label className="form-label text-muted small fw-medium mb-1">ID del Paciente</label>
            <input
              type="number"
              name="id_paciente"
              className="form-control bg-light border-0 focus-ring focus-ring-primary"
              style={{ boxShadow: 'none' }}
              value={formData.id_paciente || ''}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none' }}
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label text-muted small fw-medium mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            rows={4}
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none', resize: 'none' }}
            value={formData.observaciones || ""}
            onChange={handleChange}
            placeholder="Anotaciones relevantes sobre este recordatorio..."
          />
        </div>
      </div>

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
          <span>{id ? "Actualizar Registro" : "Guardar Registro"}</span>
        </button>
      </div>
    </form>
  );
};

export default R24Form;
