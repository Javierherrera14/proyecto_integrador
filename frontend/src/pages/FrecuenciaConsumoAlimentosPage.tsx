// src/pages/FrecuenciaConsumoAlimentosPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import FrecuenciaConsumoAlimentosForm from "../components/Frecuencia_Consumo_Alimentos/FrecuenciaConsumoAlimentosForm";
import { ArrowLeftCircle, CalendarDays } from "lucide-react";

const FrecuenciaConsumoAlimentosPage: React.FC = () => {
  const { idPaciente } = useParams<{ idPaciente: string }>();
  const navigate = useNavigate();

  if (!idPaciente) return <div className="p-5 text-center text-danger">Error: No se proporcionó ID de paciente.</div>;

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            <CalendarDays size={24} color="var(--color-primary)" />
            Frecuencia de Consumo de Alimentos
          </h3>
          <p className="text-muted mb-0">Registre qué tan seguido el paciente consume distintos alimentos.</p>
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
          <FrecuenciaConsumoAlimentosForm idPaciente={parseInt(idPaciente)} />
        </div>
      </div>
    </div>
  );
};

export default FrecuenciaConsumoAlimentosPage;
