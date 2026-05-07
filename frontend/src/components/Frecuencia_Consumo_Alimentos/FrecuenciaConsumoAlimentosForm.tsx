import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createFrecuenciaConsumoAlimentos,
  getFrecuenciaConsumoAlimentosByPaciente,
  updateFrecuenciaConsumoAlimentos,
} from "../../services/FrecuenciaConsumoAlimentosService";
import type { FrecuenciaConsumoAlimentos } from "../../types";

interface Props {
  idPaciente: number;
}

const FrecuenciaConsumoAlimentosForm: React.FC<Props> = ({ idPaciente }) => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState<FrecuenciaConsumoAlimentos[]>([]);

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
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setFormList([emptyForm()]);
      }
    };
    fetchData();
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
    try {
      for (const formData of formList) {
        if (formData.id === 0) {
          await createFrecuenciaConsumoAlimentos(formData);
        } else {
          await updateFrecuenciaConsumoAlimentos(formData.id, formData);
        }
      }
      alert("Datos guardados exitosamente");
      setTimeout(() => navigate("/pacientes"), 3000);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar los datos");
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
    navigate("/pacientes");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <h3 className="mb-4 text-center fw-bold">Frecuencia de Consumo de Alimentos</h3>
      <form onSubmit={handleSubmit}>
        {formList.map((form, index) => (
          <div key={index} className="card mb-4 shadow-sm border-0 bg-body-tertiary">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Grupo de alimentos</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.grupo_alimentos}
                    onChange={(e) => handleChange(index, "grupo_alimentos", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Alimento</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.alimento}
                    onChange={(e) => handleChange(index, "alimento", e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-4">
                {/* Consume */}
                <div className="col-md-4">
                  <div className="border rounded p-3 bg-light h-100">
                    <h6 className="text-center fw-bold mb-3">¿Consume?</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.consume_si}
                        onChange={(e) => handleChange(index, "consume_si", e.target.checked)}
                      />
                      <label className="form-check-label">Sí</label>
                    </div>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.consume_no}
                        onChange={(e) => handleChange(index, "consume_no", e.target.checked)}
                      />
                      <label className="form-check-label">No</label>
                    </div>
                  </div>
                </div>

                {/* Frecuencia */}
                <div className="col-md-4">
                  <div className="border rounded p-3 bg-light h-100">
                    <h6 className="text-center fw-bold mb-3">Frecuencia</h6>
                    {!form.consume_no && (
                      <>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.consume_dia}
                            onChange={(e) => handleChange(index, "consume_dia", e.target.checked)}
                          />
                          <label className="form-check-label">Por Día</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.frecuencia_dia}
                            onChange={(e) => handleChange(index, "frecuencia_dia", e.target.checked)}
                          />
                          <label className="form-check-label">Frecuencia Día</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.frecuencia_semana}
                            onChange={(e) => handleChange(index, "frecuencia_semana", e.target.checked)}
                          />
                          <label className="form-check-label">Frecuencia Semana</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.frecuencia_mes}
                            onChange={(e) => handleChange(index, "frecuencia_mes", e.target.checked)}
                          />
                          <label className="form-check-label">Frecuencia Mes</label>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Clasificación */}
                <div className="col-md-4">
                  <div className="border rounded p-3 bg-light h-100">
                    <h6 className="text-center fw-bold mb-3">Clasificación</h6>
                    {!form.consume_no && (
                      <>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.clasificacion_poco_frecuente}
                            onChange={(e) =>
                              handleChange(index, "clasificacion_poco_frecuente", e.target.checked)
                            }
                          />
                          <label className="form-check-label">Poco frecuente</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.clasificacion_frecuente}
                            onChange={(e) =>
                              handleChange(index, "clasificacion_frecuente", e.target.checked)
                            }
                          />
                          <label className="form-check-label">Frecuente</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.clasificacion_muy_frecuente}
                            onChange={(e) =>
                              handleChange(index, "clasificacion_muy_frecuente", e.target.checked)
                            }
                          />
                          <label className="form-check-label">Muy frecuente</label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemoveRow(index)}
                >
                  <i className="bi bi-trash3 me-1"></i>Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between align-items-center mt-4">
          <button type="button" className="btn btn-success" onClick={handleAddRow}>
            <i className="bi bi-plus-circle me-2"></i>Añadir alimento
          </button>
          <div>
            <button type="submit" className="btn btn-primary me-2">
              <i className="bi bi-save me-1"></i>Guardar
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              <i className="bi bi-x-circle me-1"></i>Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FrecuenciaConsumoAlimentosForm;
