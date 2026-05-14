import React, { useState } from "react";
import type { DatosAlimentarios } from "../../types";
import { Save, XCircle, AlertTriangle, Coffee, Heart, HeartCrack, Pill, AlertCircle } from "lucide-react";

interface Props {
  datos: DatosAlimentarios;
  onChange: (e: React.ChangeEvent<any>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing: boolean;
  onCancel: () => void;
}

export default function DatosAlimentariosForm({
  datos,
  onChange,
  onSubmit,
  isEditing,
  onCancel,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(e);
    } catch (err) {
      setError("Ocurrió un error al guardar los datos alimentarios.");
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

      {/* BLOQUE 1: RESTRICCIONES Y PREFERENCIAS */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Heart size={18} /> Preferencias e Intolerancias
      </h6>
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="p-3 bg-light rounded-4 border h-100">
            <div className="form-check form-switch d-flex align-items-center gap-2 mb-3 p-0">
              <input
                className="form-check-input m-0"
                type="checkbox"
                id="intolerancia_alimentos"
                name="intolerancia_alimentos"
                checked={datos.intolerancia_alimentos}
                onChange={onChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <label className="form-check-label fw-bold text-dark m-0" htmlFor="intolerancia_alimentos">
                ¿Intolerancia a alimentos?
              </label>
            </div>
            {datos.intolerancia_alimentos && (
              <div>
                <label className="form-label text-muted small fw-medium mb-1">Especifique intolerancias</label>
                <textarea
                  className="form-control border-0 focus-ring focus-ring-primary"
                  name="alimentos_intolerancia"
                  rows={2}
                  style={{ boxShadow: 'none', resize: 'none' }}
                  value={datos.alimentos_intolerancia}
                  onChange={onChange}
                  placeholder="Ej. Lactosa, Gluten..."
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 bg-light rounded-4 border h-100">
            <div className="form-check form-switch d-flex align-items-center gap-2 mb-3 p-0">
              <input
                className="form-check-input m-0"
                type="checkbox"
                id="problemas_digestivos"
                name="problemas_digestivos"
                checked={datos.problemas_digestivos}
                onChange={onChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <label className="form-check-label fw-bold text-dark m-0" htmlFor="problemas_digestivos">
                ¿Problemas digestivos?
              </label>
            </div>
            {datos.problemas_digestivos && (
              <div>
                <label className="form-label text-muted small fw-medium mb-1">Tipo de problema</label>
                <input
                  type="text"
                  className="form-control border-0 focus-ring focus-ring-primary"
                  name="tipo_problema_digestivo"
                  style={{ boxShadow: 'none' }}
                  value={datos.tipo_problema_digestivo}
                  onChange={onChange}
                  placeholder="Ej. Reflujo, Acidez..."
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Alimentos que le agradan</label>
          <textarea
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            name="alimentos_agradan"
            rows={3}
            style={{ boxShadow: 'none', resize: 'none' }}
            value={datos.alimentos_agradan}
            onChange={onChange}
            placeholder="Mencione alimentos favoritos..."
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-medium mb-1">Alimentos que NO le agradan</label>
          <textarea
            className="form-control bg-light border-0 focus-ring focus-ring-primary"
            name="alimentos_no_agradan"
            rows={3}
            style={{ boxShadow: 'none', resize: 'none' }}
            value={datos.alimentos_no_agradan}
            onChange={onChange}
            placeholder="Mencione alimentos que rechaza..."
          />
        </div>
      </div>

      {/* BLOQUE 2: HÁBITOS DE CONSUMO */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Coffee size={18} /> Hábitos de Consumo
      </h6>
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="p-3 bg-light rounded-4 border h-100">
            <div className="form-check form-switch d-flex flex-column gap-2 p-0 m-0">
              <label className="form-check-label fw-bold text-dark m-0" htmlFor="come_tiempo_comida">
                ¿Come a tiempo durante el día?
              </label>
              <input
                className="form-check-input m-0"
                type="checkbox"
                id="come_tiempo_comida"
                name="come_tiempo_comida"
                checked={datos.come_tiempo_comida}
                onChange={onChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
            </div>
            <div className="mt-3">
              <label className="form-label text-muted small fw-medium mb-1">Frecuencia de comida</label>
              <input
                type="text"
                className="form-control border-0 focus-ring focus-ring-primary"
                name="frecuencia_comida"
                style={{ boxShadow: 'none' }}
                value={datos.frecuencia_comida}
                onChange={onChange}
                placeholder="Ej. 3 veces al día"
              />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-3 bg-light rounded-4 border h-100">
            <div className="form-check form-switch d-flex flex-column gap-2 p-0 m-0">
              <label className="form-check-label fw-bold text-dark m-0" htmlFor="consumo_variable_emocional">
                ¿Varía su alimentación por emociones? (Ansiedad/Estrés)
              </label>
              <input
                className="form-check-input m-0"
                type="checkbox"
                id="consumo_variable_emocional"
                name="consumo_variable_emocional"
                checked={datos.consumo_variable_emocional}
                onChange={onChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-3 bg-light rounded-4 border h-100">
            <div className="form-check form-switch d-flex flex-column gap-2 p-0 m-0">
              <label className="form-check-label fw-bold text-dark m-0" htmlFor="agrega_sal">
                ¿Agrega sal a la comida ya servida?
              </label>
              <input
                className="form-check-input m-0"
                type="checkbox"
                id="agrega_sal"
                name="agrega_sal"
                checked={datos.agrega_sal}
                onChange={onChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: MEDICAMENTOS Y SUPLEMENTOS */}
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Pill size={18} /> Medicamentos y Suplementos
      </h6>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="p-3 bg-light rounded-4 border h-100">
            <div className="form-check form-switch d-flex align-items-center gap-2 mb-3 p-0">
              <input
                className="form-check-input m-0"
                type="checkbox"
                id="consume_medicamentos"
                name="consume_medicamentos"
                checked={datos.consume_medicamentos}
                onChange={onChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <label className="form-check-label fw-bold text-dark m-0" htmlFor="consume_medicamentos">
                ¿Consume medicamentos?
              </label>
            </div>
            {datos.consume_medicamentos && (
              <div>
                <label className="form-label text-muted small fw-medium mb-1">Lista de medicamentos</label>
                <textarea
                  className="form-control border-0 focus-ring focus-ring-primary"
                  name="lista_medicamentos"
                  rows={2}
                  style={{ boxShadow: 'none', resize: 'none' }}
                  value={datos.lista_medicamentos}
                  onChange={onChange}
                  placeholder="Especifique cuáles..."
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 bg-light rounded-4 border h-100">
            <div className="form-check form-switch d-flex align-items-center gap-2 p-0 m-0">
              <input
                className="form-check-input m-0"
                type="checkbox"
                id="toma_suplementos"
                name="toma_suplementos"
                checked={datos.toma_suplementos}
                onChange={onChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <label className="form-check-label fw-bold text-dark m-0" htmlFor="toma_suplementos">
                ¿Toma suplementos nutricionales o vitamínicos?
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <div className="d-flex flex-column flex-md-row gap-3 mt-4 pt-3 border-top">
        <button 
          type="button" 
          className="btn btn-light text-muted d-flex align-items-center justify-content-center gap-2 py-2 px-4" 
          onClick={onCancel}
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
          <span>{isEditing ? "Actualizar Datos" : "Guardar Datos"}</span>
        </button>
      </div>
    </form>
  );
}
