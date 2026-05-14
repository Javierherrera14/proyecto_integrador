import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import R24Form from "../components/R24/R24Form";
import { ArrowLeftCircle, Clock } from "lucide-react";

const R24Page: React.FC = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            <Clock size={24} color="var(--color-primary)" />
            Recordatorio de 24 Horas
          </h3>
          <p className="text-muted mb-0">Registre el recordatorio alimentario general del paciente.</p>
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
          <R24Form idPaciente={idPaciente ? parseInt(idPaciente) : undefined} />
        </div>
      </div>
    </div>
  );
};

export default R24Page;
