import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCircunstanciaAmbiental,
  getCircunstancias,
  updateCircunstanciaAmbiental,
} from "../../services/circunstanciasAmbientalesService";
import type { CircunstanciaAmbiental } from "../../types";
import { Save, XCircle, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

const defaultState: CircunstanciaAmbiental = {
  id: undefined,
  id_paciente: 0,
  acalasia: false,
  alcoholismo: false,
  esclerosis_lateral_amiotrofica: false,
  demencia: false,
  abuso_drogas: false,
  trastornos_alimentacion: false,
  sindrome_guillain_barre: false,
  desordenes_mentales: false,
  distrofias_musculares: false,
  dolor: false,
  anemia_falciforme: false,
  limitaciones_economicas: false,
};

const CircunstanciasAmbientalesForm = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CircunstanciaAmbiental>(defaultState);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getCircunstancias();
        const existente = data.find((c) => c.id_paciente === parseInt(idPaciente || ""));
        if (existente) {
          setFormData(existente);
          setEditId(existente.id ?? null);
        } else {
          setFormData((prev) => ({
            ...prev,
            id_paciente: parseInt(idPaciente || ""),
          }));
        }
      } catch (err) {
        console.error("Error al cargar circunstancias:", err);
        setError("Error al cargar circunstancias");
      } finally {
        setLoading(false);
      }
    };
    if (idPaciente) {
      cargarDatos();
    }
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
      if (editId) {
        await updateCircunstanciaAmbiental(editId, formData);
      } else {
        await createCircunstanciaAmbiental(formData);
      }
      navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Error al guardar circunstancia ambiental");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
  };

  const campos = Object.entries(formData).filter(
    ([key]) => key !== "id" && key !== "id_paciente"
  );

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
        <AlertTriangle size={20} /> Factores Ambientales y Sociales (Marcar si está presente)
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
          <span>{editId ? "Actualizar Datos" : "Guardar Datos"}</span>
        </button>
      </div>
    </form>
  );
};

export default CircunstanciasAmbientalesForm;
