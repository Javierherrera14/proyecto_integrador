// src/pages/ExamenFisicoPage.tsx
import { useParams } from "react-router-dom";
import ExamenFisicoForm from "../components/Examen_Fisico/ExamenFisicoForm";

const ExamenFisicoPage = () => {
  const { idPaciente } = useParams();

  if (!idPaciente) {
    return <p className="text-danger">ID del paciente no proporcionado.</p>;
  }

  return (
    <div>
      <ExamenFisicoForm idPaciente={parseInt(idPaciente)} />
    </div>
  );
};

export default ExamenFisicoPage;
