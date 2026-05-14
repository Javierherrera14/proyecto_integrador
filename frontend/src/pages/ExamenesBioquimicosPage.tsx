import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getExamenes,
  createExamen,
  updateExamen,
  deleteExamen,
} from "../services/examenesBioquimicosService";
import type { ExamenBioquimico } from "../types";
import ExamenesBioquimicosForm from "../components/Examenes_Bioquimicos/ExamenesBioquimicosForm";
import { ArrowLeftCircle, FileText } from "lucide-react";

const ExamenesBioquimicosPage = () => {
  const { id } = useParams();
  const id_paciente = Number(id);
  const navigate = useNavigate();

  const [examenes, setExamenes] = useState<ExamenBioquimico[]>([]);
  const [editando, setEditando] = useState<ExamenBioquimico | null>(null);

  const fetchExamenes = async () => {
    try {
      const data = await getExamenes();
      const filtrados = data.filter((ex) => ex.id_paciente === id_paciente);
      setExamenes(filtrados);
      
      // Si hay al menos un examen, usar el último para editar en lugar de crear uno nuevo siempre
      if (filtrados.length > 0) {
        setEditando(filtrados[0]); // Asumimos un examen por paciente por ahora o editamos el último
      }
    } catch (error) {
      console.error("Error al cargar exámenes", error);
    }
  };

  useEffect(() => {
    fetchExamenes();
  }, [id_paciente]);

  const handleGuardar = async (data: Omit<ExamenBioquimico, "id">) => {
    try {
      if (editando) {
        await updateExamen(editando.id, data);
      } else {
        await createExamen(data);
      }
      navigate(id_paciente ? `/pacientes/ver/${id_paciente}` : '/pacientes');
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            <FileText size={24} color="var(--color-primary)" />
            Exámenes Bioquímicos
          </h3>
          <p className="text-muted mb-0">Resultados e interpretación de laboratorio.</p>
        </div>
        <button className="btn btn-light text-muted d-flex align-items-center gap-2 border-0" onClick={() => navigate(`/pacientes/ver/${id_paciente}`)}>
          <ArrowLeftCircle size={20} /> Volver
        </button>
      </div>

      <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="card-body p-4 p-md-5">
          <ExamenesBioquimicosForm
            onSubmit={handleGuardar}
            initialData={editando ? { ...editando } : undefined}
            editando={!!editando}
            idPaciente={id_paciente}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamenesBioquimicosPage;
