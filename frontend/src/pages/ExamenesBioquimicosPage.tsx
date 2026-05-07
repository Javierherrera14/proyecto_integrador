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
import ExamenesBioquimicosList from "../components/Examenes_Bioquimicos/ExamenesBioquimicosList";

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
    } catch (error) {
      alert("Error al cargar exámenes");
    }
  };

  useEffect(() => {
    fetchExamenes();
  }, [id_paciente]);

  const handleGuardar = async (data: Omit<ExamenBioquimico, "id">) => {
    try {
      if (editando) {
        await updateExamen(editando.id, data);
        alert("Examen actualizado exitosamente");
      } else {
        await createExamen(data);
        alert("Examen creado exitosamente");
      }
      setTimeout(() => navigate("/pacientes"), 3000);
      fetchExamenes();
      setEditando(null);
    } catch {
      alert("Error al guardar el examen");
    }
  };

  const handleEditar = (ex: ExamenBioquimico) => {
    setEditando(ex);
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar este examen?")) return;
    try {
      await deleteExamen(id);
      fetchExamenes();
    } catch {
      alert("Error al eliminar examen");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Formulario de Exámenes Bioquímicos</h3>
      <ExamenesBioquimicosForm
        onSubmit={handleGuardar}
        initialData={editando ? { ...editando } : undefined}
        editando={!!editando}
        idPaciente={id_paciente}
      />

      <hr />
      
    </div>
  );
};

export default ExamenesBioquimicosPage;
