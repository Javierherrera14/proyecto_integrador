import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDatosAlimentariosByPacienteId,
  createDatosAlimentarios,
  updateDatosAlimentarios,
} from "../services/datosAlimentariosService";
import type { DatosAlimentarios } from "../types";
import DatosAlimentariosForm from "../components/Datos_Alimentarios/DatosAlimentariosForm";
import { ArrowLeftCircle, Utensils } from "lucide-react";

const initialState: DatosAlimentarios = {
  paciente_id: 0,
  intolerancia_alimentos: false,
  alimentos_intolerancia: "",
  consumo_variable_emocional: false,
  come_tiempo_comida: false,
  frecuencia_comida: "",
  problemas_digestivos: false,
  tipo_problema_digestivo: "",
  consume_medicamentos: false,
  lista_medicamentos: "",
  toma_suplementos: false,
  agrega_sal: false,
  alimentos_no_agradan: "",
  alimentos_agradan: "",
};

export default function DatosAlimentariosPage() {
  const { paciente_id } = useParams<{ paciente_id: string }>();
  const navigate = useNavigate();
  const [datos, setDatos] = useState<DatosAlimentarios>(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const idPaciente = paciente_id ? Number(paciente_id) : 0;

  useEffect(() => {
    if (idPaciente) {
      getDatosAlimentariosByPacienteId(idPaciente)
        .then((res) => {
          if (res && Object.keys(res).length > 0) {
            setDatos(res);
            setIsEditing(true);
          } else {
            setDatos({ ...initialState, paciente_id: idPaciente });
            setIsEditing(false);
          }
        })
        .catch(() => {
          setDatos({ ...initialState, paciente_id: idPaciente });
          setIsEditing(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [idPaciente]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    const isCheckbox = type === "checkbox";

    setDatos((prev) => ({
      ...prev,
      [name]: isCheckbox && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDatosAlimentarios(idPaciente, datos);
      } else {
        await createDatosAlimentarios(datos);
      }
      navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes');
    } catch (error) {
      console.error("Error guardando datos:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="container py-5 d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Cargando datos alimentarios...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            <Utensils size={24} color="var(--color-primary)" />
            Datos Alimentarios
          </h3>
          <p className="text-muted mb-0">Hábitos de consumo, preferencias e intolerancias.</p>
        </div>
        <button 
          className="btn btn-light text-muted d-flex align-items-center gap-2 border-0" 
          onClick={() => navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes')}
        >
          <ArrowLeftCircle size={20} /> Volver
        </button>
      </div>

      <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="card-body p-4 p-md-5">
          <DatosAlimentariosForm
            datos={datos}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEditing={isEditing}
            onCancel={() => navigate(idPaciente ? `/pacientes/ver/${idPaciente}` : '/pacientes')}
          />
        </div>
      </div>
    </div>
  );
}
