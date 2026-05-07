import React from "react";
import { useParams } from "react-router-dom";
import R24Form from "../components/R24/R24Form";

const R24Page: React.FC = () => {
  const { idPaciente} = useParams();

  return <R24Form idPaciente={idPaciente ? parseInt(idPaciente) : undefined} />;
};

export default R24Page;
