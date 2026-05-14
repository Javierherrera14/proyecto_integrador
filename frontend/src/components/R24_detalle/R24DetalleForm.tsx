// src/components/R24Detalle/R24DetalleForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearR24Detalle, obtenerR24Detalle, actualizarR24Detalle } from "../../services/r24DetalleService";
import type { R24Detalle } from "../../types";
import { Save, XCircle, AlertCircle, UtensilsCrossed } from "lucide-react";

interface Props {
  idR24: number;
}

const R24DetalleForm: React.FC<Props> = ({ idR24 }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<R24Detalle>({
    id_r24: idR24,
    tiempo_comida: "",
    lugar: "",
    hora: "",
    preparacion: "",
    alimento_id: undefined,
    medida_casera: "",
    gramos_consumidos: undefined,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      obtenerR24Detalle(parseInt(id))
        .then(data => setFormData(data))
        .catch(() => setError("Error al cargar el detalle."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "gramos_consumidos" || name === "alimento_id" ? parseFloat(value) || undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (id) {
        await actualizarR24Detalle(parseInt(id), formData);
      } else {
        await crearR24Detalle(formData);
      }
      navigate(-1);
    } catch (error) {
      console.error("Error al guardar detalle:", error);
      setError("Error al guardar el detalle del alimento.");
    } finally {
      setIsSubmitting(false);
    }
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
        <UtensilsCrossed size={18} /> Información del Alimento
      </h6>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Tiempo de comida</label>
          <select
            name="tiempo_comida"
            className="form-select bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none' }}
            value={formData.tiempo_comida}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Desayuno">Desayuno</option>
            <option value="Media Mañana">Media Mañana</option>
            <option value="Almuerzo">Almuerzo</option>
            <option value="Media Tarde">Media Tarde</option>
            <option value="Cena">Cena</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Hora</label>
          <input
            type="time"
            name="hora"
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none' }}
            value={formData.hora || ""}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Lugar de consumo</label>
          <input
            type="text"
            name="lugar"
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none' }}
            value={formData.lugar || ""}
            onChange={handleChange}
            placeholder="Ej. Casa, Trabajo, Restaurante..."
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">ID del Alimento (BD)</label>
          <input
            type="number"
            name="alimento_id"
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none' }}
            value={formData.alimento_id || ""}
            onChange={handleChange}
            placeholder="Buscar ID..."
          />
        </div>

        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Medida casera</label>
          <input
            type="text"
            name="medida_casera"
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none' }}
            value={formData.medida_casera || ""}
            onChange={handleChange}
            placeholder="Ej. 1 taza, 2 cucharadas..."
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Gramos consumidos</label>
          <input
            type="number"
            name="gramos_consumidos"
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none' }}
            value={formData.gramos_consumidos || ""}
            onChange={handleChange}
            step="0.1"
            placeholder="Ej. 150"
          />
        </div>

        <div className="col-12">
          <label className="form-label text-muted small fw-medium mb-1">Preparación / Notas</label>
          <textarea
            name="preparacion"
            rows={3}
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            style={{ boxShadow: 'none', resize: 'none' }}
            value={formData.preparacion || ""}
            onChange={handleChange}
            placeholder="Ej. Frito, cocido al vapor, sin sal..."
          />
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row gap-3 mt-4 pt-3 border-top">
        <button 
          type="button" 
          className="btn btn-light text-muted d-flex align-items-center justify-content-center gap-2 py-2 px-4" 
          onClick={() => navigate(-1)}
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
          <span>{id ? "Actualizar Detalle" : "Guardar Detalle"}</span>
        </button>
      </div>
    </form>
  );
};

export default R24DetalleForm;
