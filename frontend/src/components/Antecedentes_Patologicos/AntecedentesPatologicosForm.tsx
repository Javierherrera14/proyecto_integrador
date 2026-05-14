import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAntecedente,
  getAntecedentes,
  updateAntecedente,
} from "../../services/antecedentesPatologicosService";
import type { AntecedentePatologico } from "../../types";
import { Save, XCircle, CheckCircle2, AlertCircle, Users, User, Stethoscope } from "lucide-react";

const defaultState: AntecedentePatologico = {
  id: undefined,
  id_paciente: 0,
  hipertension_personal: false,
  hipercolesterolemia_personal: false,
  diabetes_personal: false,
  hipertrigliceridemia_personal: false,
  obesidad_personal: false,
  enfermedad_cardiovascular_personal: false,
  enfermedad_renal_personal: false,
  enfermedad_gastrointestinal_personal: false,
  hipertension_familiar: false,
  hipercolesterolemia_familiar: false,
  diabetes_familiar: false,
  hipertrigliceridemia_familiar: false,
  obesidad_familiar: false,
  enfermedad_cardiovascular_familiar: false,
  enfermedad_renal_familiar: false,
  enfermedad_gastrointestinal_familiar: false,
  quirurgicos: "",
};

const AntecedentesPatologicosForm = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AntecedentePatologico>(defaultState);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getAntecedentes();
        const existente = data.find(
          (a) => a.id_paciente === parseInt(idPaciente || "")
        );
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
        setError("Error al cargar los antecedentes");
      } finally {
        setLoading(false);
      }
    };

    if (idPaciente) {
      cargarDatos();
    }
  }, [idPaciente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    let finalValue: any = value;
    if (type === "checkbox") {
        finalValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editId) {
        await updateAntecedente(editId, formData);
      } else {
        await createAntecedente(formData);
      }
      navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
    } catch (err) {
      setError("Error al guardar el antecedente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
  };

  const renderCheckboxGroup = (title: string, keys: string[], icon: React.ReactNode) => (
    <div className="mb-5">
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        {icon} {title}
      </h6>
      <div className="row g-3">
        {keys.map((key) => (
          <div className="col-md-4 col-sm-6" key={key}>
            <div className="form-check form-switch p-3 bg-light rounded-3 d-flex align-items-center gap-3 h-100 m-0 border border-1" style={{ borderColor: 'var(--color-border)' }}>
              <input
                className="form-check-input m-0 flex-shrink-0"
                type="checkbox"
                id={key}
                name={key}
                checked={formData[key as keyof AntecedentePatologico] as boolean}
                onChange={handleChange}
                style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <label className="form-check-label text-muted fw-medium m-0" htmlFor={key} style={{ cursor: 'pointer' }}>
                {key
                  .replace(/_/g, " ")
                  .replace(/personal/g, "")
                  .replace(/familiar/g, "")
                  .trim()
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const personales = Object.keys(formData).filter((key) =>
    key.endsWith("_personal")
  );
  const familiares = Object.keys(formData).filter((key) =>
    key.endsWith("_familiar")
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

      {renderCheckboxGroup("Antecedentes Personales", personales, <User size={20} />)}
      {renderCheckboxGroup("Antecedentes Familiares", familiares, <Users size={20} />)}

      <div className="mb-4">
        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
          <Stethoscope size={20} /> Antecedentes Quirúrgicos
        </h6>
        <div className="p-3 bg-light rounded-4 border">
          <label className="form-label text-muted small fw-medium mb-2">Describa los antecedentes quirúrgicos (si los hay)</label>
          <textarea
            rows={4}
            name="quirurgicos"
            className="form-control focus-ring focus-ring-primary border-0 bg-white"
            style={{ boxShadow: 'none', resize: 'none' }}
            value={formData.quirurgicos}
            onChange={handleChange}
            placeholder="Intervenciones previas, fechas, complicaciones..."
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
          <span>Guardar Antecedentes</span>
        </button>
      </div>
    </form>
  );
};

export default AntecedentesPatologicosForm;
