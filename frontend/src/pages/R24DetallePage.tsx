// src/pages/R24DetallePage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import R24DetalleForm from "../components/R24_detalle/R24DetalleForm";
import { ArrowLeftCircle, ClipboardList } from "lucide-react";

const R24DetallePage: React.FC = () => {
  const { idR24 } = useParams();
  const navigate = useNavigate();

  if (!idR24) return <div className="p-5 text-center text-danger">ID de R24 no proporcionado.</div>;

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            <ClipboardList size={24} color="var(--color-primary)" />
            Detalle de Alimento
          </h3>
          <p className="text-muted mb-0">Añada o edite un alimento específico para el recordatorio de 24h.</p>
        </div>
        <button 
          className="btn btn-light text-muted d-flex align-items-center gap-2 border-0" 
          onClick={() => navigate(-1)} // En este caso, navigate(-1) es seguro porque vienes del R24 general, o podemos enviarlo a /pacientes si falla
        >
          <ArrowLeftCircle size={20} /> Volver
        </button>
      </div>

      <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="card-body p-4 p-md-5">
          <R24DetalleForm idR24={parseInt(idR24)} />
        </div>
      </div>
    </div>
  );
};

export default R24DetallePage;
