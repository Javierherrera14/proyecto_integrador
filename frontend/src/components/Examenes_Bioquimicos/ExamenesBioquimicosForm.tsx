import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ExamenBioquimico } from "../../types";
import { Save, XCircle, FileText, CheckCircle2, AlertCircle, Activity } from "lucide-react";

interface Props {
  onSubmit: (data: Omit<ExamenBioquimico, "id">) => Promise<void>;
  initialData?: Omit<ExamenBioquimico, "id">;
  editando?: boolean;
  idPaciente: number;
}

const defaultState: Omit<ExamenBioquimico, "id"> = {
  id_paciente: 0,
  hemoglobina_glicada: 0,
  glicemia_basal: 0,
  colesterol_total: 0,
  colesterol_hdl: 0,
  colesterol_ldl: 0,
  trigliceridos: 0,
  creatinina: 0,
  interpretacion_hemoglobina: "",
  interpretacion_glicemia: "",
  interpretacion_colesterol_total: "",
  interpretacion_colesterol_hdl: "",
  interpretacion_colesterol_ldl: "",
  interpretacion_trigliceridos: "",
  interpretacion_creatinina: "",
};

const ExamenesBioquimicosForm = ({
  onSubmit,
  initialData,
  editando = false,
  idPaciente,
}: Props) => {
  const [formData, setFormData] = useState<Omit<ExamenBioquimico, "id">>(
    initialData || defaultState
  );
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData((prev) => ({
        ...prev,
        id_paciente: idPaciente,
      }));
    }
  }, [idPaciente, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) || value === "" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      if (!editando) {
        setFormData({ ...defaultState, id_paciente: idPaciente });
      }
    } catch (err) {
      setError("Error al guardar el examen bioquímico.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
    navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
  };

  const metricas = [
    { label: "Hemoglobina Glicada", valKey: "hemoglobina_glicada", intKey: "interpretacion_hemoglobina", unit: "%" },
    { label: "Glicemia Basal", valKey: "glicemia_basal", intKey: "interpretacion_glicemia", unit: "mg/dL" },
    { label: "Colesterol Total", valKey: "colesterol_total", intKey: "interpretacion_colesterol_total", unit: "mg/dL" },
    { label: "Colesterol HDL", valKey: "colesterol_hdl", intKey: "interpretacion_colesterol_hdl", unit: "mg/dL" },
    { label: "Colesterol LDL", valKey: "colesterol_ldl", intKey: "interpretacion_colesterol_ldl", unit: "mg/dL" },
    { label: "Triglicéridos", valKey: "trigliceridos", intKey: "interpretacion_trigliceridos", unit: "mg/dL" },
    { label: "Creatinina", valKey: "creatinina", intKey: "interpretacion_creatinina", unit: "mg/dL" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3 border-0" role="alert">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-2 border-bottom" style={{ color: 'var(--color-primary)' }}>
        <Activity size={20} /> Registro de Valores e Interpretación
      </h5>

      <div className="row g-4 mb-4">
        {metricas.map((item) => (
          <div className="col-md-6" key={item.valKey}>
            <div className="p-3 bg-light rounded-4 border">
              <label className="fw-bold text-dark mb-3">{item.label}</label>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-medium mb-1">Valor ({item.unit})</label>
                <input
                  type="number"
                  step="0.01"
                  name={item.valKey}
                  className="form-control focus-ring focus-ring-primary border-0"
                  style={{ boxShadow: 'none' }}
                  value={formData[item.valKey as keyof ExamenBioquimico] as number}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label text-muted small fw-medium mb-1">Interpretación</label>
                <input
                  type="text"
                  name={item.intKey}
                  className="form-control focus-ring focus-ring-primary border-0"
                  style={{ boxShadow: 'none' }}
                  value={formData[item.intKey as keyof ExamenBioquimico] as string}
                  onChange={handleChange}
                  placeholder="Ej. Normal, Alto, Bajo..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column flex-md-row gap-3 mt-4 pt-3 border-top">
        <button 
          type="button" 
          className="btn btn-light text-muted d-flex align-items-center justify-content-center gap-2 py-2 px-4" 
          onClick={handleCancelar}
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
          <span>{editando ? "Actualizar Exámenes" : "Guardar Exámenes"}</span>
        </button>
      </div>
    </form>
  );
};

export default ExamenesBioquimicosForm;
