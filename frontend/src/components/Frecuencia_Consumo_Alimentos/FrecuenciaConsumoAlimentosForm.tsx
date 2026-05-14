import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createFrecuenciaConsumoAlimentos,
  getFrecuenciaConsumoAlimentosByPaciente,
  updateFrecuenciaConsumoAlimentos,
} from "../../services/FrecuenciaConsumoAlimentosService";
import type { FrecuenciaConsumoAlimentos } from "../../types";
import { Save, XCircle, PlusCircle, Trash2, ListChecks, AlertCircle } from "lucide-react";

interface Props {
  idPaciente: number;
}

const FrecuenciaConsumoAlimentosForm: React.FC<Props> = ({ idPaciente }) => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState<FrecuenciaConsumoAlimentos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emptyForm = (): FrecuenciaConsumoAlimentos => ({
    id: 0,
    id_paciente: idPaciente,
    grupo_alimentos: "",
    alimento: "",
    consume_si: false,
    consume_no: false,
    consume_dia: false,
    frecuencia_dia: false,
    frecuencia_semana: false,
    frecuencia_mes: false,
    clasificacion_poco_frecuente: false,
    clasificacion_frecuente: false,
    clasificacion_muy_frecuente: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFrecuenciaConsumoAlimentosByPaciente(idPaciente);
        if (Array.isArray(response) && response.length > 0) {
          setFormList(response);
        } else {
          setFormList([emptyForm()]);
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setFormList([emptyForm()]);
      } finally {
        setLoading(false);
      }
    };
    if (idPaciente) fetchData();
  }, [idPaciente]);

  const handleChange = (index: number, field: keyof FrecuenciaConsumoAlimentos, value: any) => {
    const newList = [...formList];
    (newList[index] as any)[field] = value;

    if (field === "consume_si" && value) {
      newList[index].consume_no = false;
    } else if (field === "consume_no" && value) {
      newList[index].consume_si = false;
      newList[index].consume_dia = false;
      newList[index].frecuencia_dia = false;
      newList[index].frecuencia_semana = false;
      newList[index].frecuencia_mes = false;
      newList[index].clasificacion_poco_frecuente = false;
      newList[index].clasificacion_frecuente = false;
      newList[index].clasificacion_muy_frecuente = false;
    }

    setFormList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      for (const formData of formList) {
        if (formData.id === 0) {
          await createFrecuenciaConsumoAlimentos(formData);
        } else {
          await updateFrecuenciaConsumoAlimentos(formData.id, formData);
        }
      }
      navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Hubo un error al guardar los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRow = () => {
    setFormList([...formList, emptyForm()]);
  };

  const handleRemoveRow = (index: number) => {
    const newList = [...formList];
    newList.splice(index, 1);
    setFormList(newList);
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

      {formList.map((form, index) => (
        <div key={index} className="card mb-4 shadow-sm border-0 bg-light rounded-4">
          <div className="card-header bg-transparent border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--color-primary)' }}>
              <ListChecks size={18} /> Registro #{index + 1}
            </h6>
            {formList.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 border-0"
                onClick={() => handleRemoveRow(index)}
              >
                <Trash2 size={16} /> Eliminar
              </button>
            )}
          </div>
          <div className="card-body p-4">
            <div className="row mb-4 g-3">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-medium mb-1">Grupo de alimentos</label>
                <input
                  type="text"
                  className="form-control border-0 focus-ring focus-ring-primary"
                  style={{ boxShadow: 'none' }}
                  value={form.grupo_alimentos}
                  onChange={(e) => handleChange(index, "grupo_alimentos", e.target.value)}
                  placeholder="Ej. Lácteos, Carnes..."
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-medium mb-1">Alimento específico</label>
                <input
                  type="text"
                  className="form-control border-0 focus-ring focus-ring-primary"
                  style={{ boxShadow: 'none' }}
                  value={form.alimento}
                  onChange={(e) => handleChange(index, "alimento", e.target.value)}
                  placeholder="Ej. Leche entera, Pollo..."
                  required
                />
              </div>
            </div>

            <div className="row g-4">
              {/* Consume */}
              <div className="col-md-4">
                <div className="bg-white rounded-3 p-3 border h-100">
                  <label className="form-label text-dark fw-bold mb-3 d-block text-center border-bottom pb-2">¿Consume?</label>
                  <div className="d-flex justify-content-around">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`si-${index}`}
                        checked={form.consume_si}
                        onChange={(e) => handleChange(index, "consume_si", e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`si-${index}`}>Sí</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`no-${index}`}
                        checked={form.consume_no}
                        onChange={(e) => handleChange(index, "consume_no", e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`no-${index}`}>No</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frecuencia */}
              <div className="col-md-4">
                <div className={`bg-white rounded-3 p-3 border h-100 ${form.consume_no ? 'opacity-50' : ''}`}>
                  <label className="form-label text-dark fw-bold mb-3 d-block text-center border-bottom pb-2">Frecuencia</label>
                  <div className="d-flex flex-column gap-2 px-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.consume_dia}
                        onChange={(e) => handleChange(index, "consume_dia", e.target.checked)}
                        disabled={form.consume_no}
                      />
                      <label className="form-check-label small text-muted">Por Día</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.frecuencia_dia}
                        onChange={(e) => handleChange(index, "frecuencia_dia", e.target.checked)}
                        disabled={form.consume_no}
                      />
                      <label className="form-check-label small text-muted">Varios al Día</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.frecuencia_semana}
                        onChange={(e) => handleChange(index, "frecuencia_semana", e.target.checked)}
                        disabled={form.consume_no}
                      />
                      <label className="form-check-label small text-muted">Por Semana</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.frecuencia_mes}
                        onChange={(e) => handleChange(index, "frecuencia_mes", e.target.checked)}
                        disabled={form.consume_no}
                      />
                      <label className="form-check-label small text-muted">Por Mes</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clasificación */}
              <div className="col-md-4">
                <div className={`bg-white rounded-3 p-3 border h-100 ${form.consume_no ? 'opacity-50' : ''}`}>
                  <label className="form-label text-dark fw-bold mb-3 d-block text-center border-bottom pb-2">Clasificación</label>
                  <div className="d-flex flex-column gap-2 px-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.clasificacion_poco_frecuente}
                        onChange={(e) => handleChange(index, "clasificacion_poco_frecuente", e.target.checked)}
                        disabled={form.consume_no}
                      />
                      <label className="form-check-label small text-muted">Poco frecuente</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.clasificacion_frecuente}
                        onChange={(e) => handleChange(index, "clasificacion_frecuente", e.target.checked)}
                        disabled={form.consume_no}
                      />
                      <label className="form-check-label small text-muted">Frecuente</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.clasificacion_muy_frecuente}
                        onChange={(e) => handleChange(index, "clasificacion_muy_frecuente", e.target.checked)}
                        disabled={form.consume_no}
                      />
                      <label className="form-check-label small text-muted">Muy frecuente</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mb-4">
        <button
          type="button"
          className="btn btn-outline-primary d-flex align-items-center gap-2 fw-medium rounded-pill px-4"
          onClick={handleAddRow}
        >
          <PlusCircle size={18} /> Añadir otro alimento
        </button>
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
          <span>Guardar Lista</span>
        </button>
      </div>
    </form>
  );
};

export default FrecuenciaConsumoAlimentosForm;
