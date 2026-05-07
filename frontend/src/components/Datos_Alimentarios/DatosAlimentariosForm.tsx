import React from "react";
import type { DatosAlimentarios } from "../../types";

interface Props {
  datos: DatosAlimentarios;
  onChange: (e: React.ChangeEvent<any>) => void;
  onSubmit: (e: React.FormEvent) => void;
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
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">
                <i className="bi bi-clipboard-heart me-2"></i>
                {isEditing ? "Editar" : "Registrar"} Datos Alimentarios
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {/* Intolerancia */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="intolerancia_alimentos"
                    name="intolerancia_alimentos"
                    checked={datos.intolerancia_alimentos}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="intolerancia_alimentos">
                    <i className="bi bi-exclamation-diamond-fill me-2 text-danger"></i>
                    ¿Tiene intolerancia a alimentos?
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="alimentos_intolerancia" className="form-label">
                    Alimentos con intolerancia
                  </label>
                  <textarea
                    className="form-control"
                    id="alimentos_intolerancia"
                    name="alimentos_intolerancia"
                    rows={2}
                    disabled={!datos.intolerancia_alimentos}
                    value={datos.alimentos_intolerancia}
                    onChange={onChange}
                  />
                </div>

                {/* Emocional */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="consumo_variable_emocional"
                    name="consumo_variable_emocional"
                    checked={datos.consumo_variable_emocional}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="consumo_variable_emocional">
                    <i className="bi bi-emoji-frown me-2 text-warning"></i>
                    ¿Varía su alimentación por emociones?
                  </label>
                </div>

                {/* Horarios */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="come_tiempo_comida"
                    name="come_tiempo_comida"
                    checked={datos.come_tiempo_comida}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="come_tiempo_comida">
                    <i className="bi bi-clock-fill me-2 text-primary"></i>
                    ¿Come a tiempo durante el día?
                  </label>
                </div>

                {/* Frecuencia */}
                <div className="mb-3">
                  <label htmlFor="frecuencia_comida" className="form-label">Frecuencia de comida</label>
                  <input
                    type="text"
                    className="form-control"
                    id="frecuencia_comida"
                    name="frecuencia_comida"
                    value={datos.frecuencia_comida}
                    onChange={onChange}
                  />
                </div>

                {/* Problemas digestivos */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="problemas_digestivos"
                    name="problemas_digestivos"
                    checked={datos.problemas_digestivos}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="problemas_digestivos">
                    <i className="bi bi-bug-fill me-2 text-danger"></i>
                    ¿Tiene problemas digestivos?
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="tipo_problema_digestivo" className="form-label">Tipo de problema</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tipo_problema_digestivo"
                    name="tipo_problema_digestivo"
                    value={datos.tipo_problema_digestivo}
                    onChange={onChange}
                    disabled={!datos.problemas_digestivos}
                  />
                </div>

                {/* Medicamentos */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="consume_medicamentos"
                    name="consume_medicamentos"
                    checked={datos.consume_medicamentos}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="consume_medicamentos">
                    <i className="bi bi-capsule-pill me-2 text-success"></i>
                    ¿Consume medicamentos?
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="lista_medicamentos" className="form-label">Lista de medicamentos</label>
                  <textarea
                    className="form-control"
                    id="lista_medicamentos"
                    name="lista_medicamentos"
                    value={datos.lista_medicamentos}
                    onChange={onChange}
                    disabled={!datos.consume_medicamentos}
                  />
                </div>

                {/* Suplementos */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="toma_suplementos"
                    name="toma_suplementos"
                    checked={datos.toma_suplementos}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="toma_suplementos">
                    <i className="bi bi-plus-circle-fill me-2 text-info"></i>
                    ¿Toma suplementos?
                  </label>
                </div>

                {/* Sal */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agrega_sal"
                    name="agrega_sal"
                    checked={datos.agrega_sal}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="agrega_sal">
                    <i className="bi bi-droplet-half me-2 text-secondary"></i>
                    ¿Agrega sal a la comida?
                  </label>
                </div>

                {/* Agradan / no agradan */}
                <div className="mb-3">
                  <label htmlFor="alimentos_no_agradan" className="form-label">Alimentos que no le agradan</label>
                  <textarea
                    className="form-control"
                    id="alimentos_no_agradan"
                    name="alimentos_no_agradan"
                    value={datos.alimentos_no_agradan}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="alimentos_agradan" className="form-label">Alimentos que le agradan</label>
                  <textarea
                    className="form-control"
                    id="alimentos_agradan"
                    name="alimentos_agradan"
                    value={datos.alimentos_agradan}
                    onChange={onChange}
                  />
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary me-2">
                    <i className="bi bi-save me-1"></i> Guardar
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    <i className="bi bi-x-circle me-1"></i> Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
