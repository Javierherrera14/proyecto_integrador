import { useParams, useNavigate } from "react-router-dom";
import AntecedentesPatologicosForm from "../components/Antecedentes_Patologicos/AntecedentesPatologicosForm";
import { ArrowLeftCircle, Stethoscope } from "lucide-react";

const AntecedentesPatologicosPage = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  if (!idPaciente) {
    return <p className="text-danger">ID del paciente no proporcionado.</p>;
  }

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            <Stethoscope size={24} color="var(--color-primary)" />
            Antecedentes Patológicos
          </h3>
          <p className="text-muted mb-0">Historial de patologías personales y familiares.</p>
        </div>
        <button className="btn btn-light text-muted d-flex align-items-center gap-2 border-0" onClick={() => navigate(`/pacientes/ver/${idPaciente}`)}>
          <ArrowLeftCircle size={20} /> Volver
        </button>
      </div>

      <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="card-body p-4 p-md-5">
          <AntecedentesPatologicosForm />
        </div>
      </div>
    </div>
  );
};

export default AntecedentesPatologicosPage;
