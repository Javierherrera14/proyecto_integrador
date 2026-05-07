// src/pages/R24DetallePage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import R24DetalleForm from "../components/R24_detalle/R24DetalleForm";

const R24DetallePage: React.FC = () => {
  const { idR24 } = useParams();

  if (!idR24) return <p>ID de R24 no proporcionado.</p>;

  return <R24DetalleForm idR24={parseInt(idR24)} />;
};

export default R24DetallePage;
