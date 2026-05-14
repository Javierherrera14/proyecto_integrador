import React, { useEffect, useState } from "react";
import HerramientaMustForm from "../components/Herramienta_Must/HerramientaMustForm";
import {
  getHerramientaPorPaciente,
  createHerramienta,
  updateHerramienta,
} from "../services/herramientaMustService";
import type { HerramientaMust, HerramientaMustCreate } from "../types";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftCircle, AlertTriangle } from "lucide-react";

const HerramientaMustPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [herramienta, setHerramienta] = useState<HerramientaMust | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const pacienteId = Number(id);
  const navigate = useNavigate();

  useEffect(() => {
    if (pacienteId) {
      getHerramientaPorPaciente(pacienteId)
        .then((data) => {
          setHerramienta(data || null);
        })
        .catch((error) => {
          console.error("Error al cargar herramienta MUST:", error);
          setError("Error al cargar los datos");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("ID de paciente inválido");
      setLoading(false);
    }
  }, [pacienteId]);

  const handleSave = async (data: HerramientaMustCreate) => {
    try {
      if (herramienta && herramienta.id) {
        await updateHerramienta(herramienta.id, data);
      } else {
        await createHerramienta({ ...data, id_paciente: pacienteId });
      }
      navigate(`/pacientes/ver/${pacienteId}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="container py-5 d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Cargando evaluación MUST...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '900px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            <AlertTriangle size={24} color="var(--color-danger)" />
            Evaluación Herramienta MUST
          </h3>
          <p className="text-muted mb-0">Malnutrition Universal Screening Tool.</p>
        </div>
        <button className="btn btn-light text-muted d-flex align-items-center gap-2 border-0" onClick={() => navigate(`/pacientes/ver/${pacienteId}`)}>
          <ArrowLeftCircle size={20} /> Volver
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-4 rounded-3 border-0">
          {error}
        </div>
      )}

      <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="card-body p-4 p-md-5">
          <HerramientaMustForm
            initialData={herramienta ?? { id_paciente: pacienteId } as HerramientaMustCreate}
            onSubmit={handleSave}
            pacienteId={pacienteId}
          />
        </div>
      </div>
    </div>
  );
};

export default HerramientaMustPage;
