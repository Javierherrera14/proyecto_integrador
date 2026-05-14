import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createExamenFisico,
  getExamenFisicoById,
  updateExamenFisico,
} from "../../services/examenFisicoService";
import type { ExamenFisico } from "../../types";
import { Save, XCircle, Stethoscope, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  idPaciente: number;
}

const ExamenFisicoForm: React.FC<Props> = ({ idPaciente }) => {
  const navigate = useNavigate();
  const [examenId, setExamenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<ExamenFisico, "id">>({
    id_paciente: idPaciente,
    petequias: false,
    dermatitis: false,
    pelagra: false,
    dermatitis_pintura_escamosa: false,
    xerosis: false,
    palidez: false,
    no_curacion_heridas: false,
    coiloniquia: false,
    linea_transversal_beau: false,
    plato_una_palido: false,
    pobre_salud_plato_una: false,
    unas_escamosas: false,
    alopecia: false,
    aclaramiento_pelo: false,
    pelo_sacacorchos: false,
    seborrea_nasolabial: false,
    manchas_bitot: false,
    keratomalacia: false,
    conjuntiva_palida: false,
    queilosis: false,
    estomatitis_angular: false,
    encias_esponjosas_sangrantes: false,
    lesiones_boca: false,
    encias_palidas: false,
    glositis: false,
    tiroides_agrandada: false,
  });

  useEffect(() => {
    const fetchExamen = async () => {
      try {
        const data = await getExamenFisicoById(idPaciente);
        const { id, ...rest } = data;
        setFormData(rest);
        setExamenId(id);
      } catch (error) {
        console.log("No hay examen físico registrado aún. Se creará uno nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamen();
  }, [idPaciente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (examenId) {
        await updateExamenFisico(examenId, formData);
      } else {
        await createExamenFisico(formData);
      }
      navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
    } catch (error) {
      console.error("Error al guardar:", error);
      setError("Error al guardar el examen físico.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
  };

  const campos = Object.entries(formData).filter(([key]) => key !== "id_paciente");

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

      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Stethoscope size={20} /> Hallazgos Clínicos (Marcar si está presente)
      </h5>

      <div className="row g-3 mb-5">
        {campos.map(([key, value]) => (
          <div className="col-md-4 col-sm-6" key={key}>
            <div className="form-check form-switch p-3 bg-light rounded-3 d-flex align-items-center gap-3 h-100 m-0 border border-1" style={{ borderColor: 'var(--color-border)' }}>
              <input
                className="form-check-input m-0 flex-shrink-0"
                type="checkbox"
                id={key}
                name={key}
                checked={value as boolean}
                onChange={handleChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <label className="form-check-label text-muted fw-medium m-0" htmlFor={key} style={{ cursor: 'pointer' }}>
                {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </label>
            </div>
          </div>
        ))}
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
          <span>{examenId ? "Actualizar Examen" : "Guardar Examen"}</span>
        </button>
      </div>
    </form>
  );
};

export default ExamenFisicoForm;
