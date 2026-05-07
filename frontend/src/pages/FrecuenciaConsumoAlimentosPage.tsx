// src/pages/FrecuenciaConsumoAlimentosPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import FrecuenciaConsumoAlimentosForm from "../components/Frecuencia_Consumo_Alimentos/FrecuenciaConsumoAlimentosForm";

const FrecuenciaConsumoAlimentosPage: React.FC = () => {
  const { idPaciente } = useParams<{ idPaciente: string }>();

  if (!idPaciente) return <p>Error: No se proporcionó ID de paciente.</p>;

  return (
    <div className="container mt-4">
      <h2>Frecuencia de Consumo de Alimentos</h2>
      <FrecuenciaConsumoAlimentosForm idPaciente={parseInt(idPaciente)} />
    </div>
  );
};

export default FrecuenciaConsumoAlimentosPage;
