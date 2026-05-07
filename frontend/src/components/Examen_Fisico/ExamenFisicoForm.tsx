import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createExamenFisico,
  getExamenFisicoById,
  updateExamenFisico,
} from "../../services/examenFisicoService";
import type { ExamenFisico } from "../../types";
import {
  Button,
  Form,
  Spinner,
  Card,
  Row,
  Col,
} from "react-bootstrap";

interface Props {
  idPaciente: number;
}

const ExamenFisicoForm: React.FC<Props> = ({ idPaciente }) => {
  const navigate = useNavigate();
  const [examenId, setExamenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Omit<ExamenFisico, "id">>({
    id_paciente: idPaciente,
    petequias: false,
    dermatitis: false,
    pelagra: false,
    dermatitis_pintura_escamosa: false,
    xerosis: false,
    palidez: false,
    no_curacion_heridas: false,
    coiloniquia: false,
    linea_transversal_beau: false,
    plato_una_palido: false,
    pobre_salud_plato_una: false,
    unas_escamosas: false,
    alopecia: false,
    aclaramiento_pelo: false,
    pelo_sacacorchos: false,
    seborrea_nasolabial: false,
    manchas_bitot: false,
    keratomalacia: false,
    conjuntiva_palida: false,
    queilosis: false,
    estomatitis_angular: false,
    encias_esponjosas_sangrantes: false,
    lesiones_boca: false,
    encias_palidas: false,
    glositis: false,
    tiroides_agrandada: false,
  });

  useEffect(() => {
    const fetchExamen = async () => {
      try {
        const data = await getExamenFisicoById(idPaciente);
        const { id, ...rest } = data;
        setFormData(rest);
        setExamenId(id);
      } catch (error) {
        console.log("No hay examen físico registrado aún. Se creará uno nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamen();
  }, [idPaciente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (examenId) {
        await updateExamenFisico(examenId, formData);
        alert("Examen físico actualizado correctamente");
      } else {
        await createExamenFisico(formData);
        alert("Examen físico creado correctamente");
      }
      navigate("/pacientes");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el examen físico.");
    }
  };

  const handleCancel = () => {
    navigate("/pacientes");
  };

  const campos = Object.entries(formData).filter(([key]) => key !== "id_paciente");

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-black text-white border-bottom">
  <h4 className="mb-0">
    {examenId ? "Editar Examen Físico" : "Nuevo Examen Físico"}
  </h4>
</Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                {campos.map(([key, value]) => (
                  <Col md={4} className="mb-3" key={key}>
                    <Form.Check
                      type="checkbox"
                      id={key}
                      label={key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      name={key}
                      checked={value as boolean}
                      onChange={handleChange}
                    />
                  </Col>
                ))}
              </Row>
              <div className="d-flex justify-content-end mt-4">
                <Button variant="primary" type="submit" className="me-2">
                  Guardar
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ExamenFisicoForm;
