import React, { useEffect, useState } from "react";
import HerramientaMustForm from "../components/Herramienta_Must/HerramientaMustForm";
import {
  getHerramientaPorPaciente,
  createHerramienta,
  updateHerramienta,
} from "../services/herramientaMustService";
import type { HerramientaMust, HerramientaMustCreate } from "../types";
import { Spinner, Alert, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

const HerramientaMustPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [herramienta, setHerramienta] = useState<HerramientaMust | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const pacienteId = Number(id);

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
    if (herramienta) {
      await updateHerramienta(herramienta.id!, data);
      alert("Registro actualizado exitosamente");
    } else {
      await createHerramienta({ ...data, id_paciente: pacienteId });
      alert("Registro creado exitosamente");
    }
  } catch (err) {
    alert("Ocurrió un error al guardar");
  }
};

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" role="status" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
  <h2 className="bg-dark text-white p-3 rounded">
    Evaluación - Herramienta MUST
  </h2>
  <HerramientaMustForm
    initialData={herramienta ?? { id_paciente: pacienteId } as HerramientaMustCreate}
    onSubmit={handleSave}
  />
</Container>

  );
};

export default HerramientaMustPage;
