import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ExamenBioquimico } from "../../types";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

interface Props {
  onSubmit: (data: Omit<ExamenBioquimico, "id">) => void;
  initialData?: Omit<ExamenBioquimico, "id">;
  editando?: boolean;
  idPaciente: number;
}

const defaultState: Omit<ExamenBioquimico, "id"> = {
  id_paciente: 0,
  hemoglobina_glicada: 0,
  glicemia_basal: 0,
  colesterol_total: 0,
  colesterol_hdl: 0,
  colesterol_ldl: 0,
  trigliceridos: 0,
  creatinina: 0,
  interpretacion_hemoglobina: "",
  interpretacion_glicemia: "",
  interpretacion_colesterol_total: "",
  interpretacion_colesterol_hdl: "",
  interpretacion_colesterol_ldl: "",
  interpretacion_trigliceridos: "",
  interpretacion_creatinina: "",
};

const ExamenesBioquimicosForm = ({
  onSubmit,
  initialData,
  editando = false,
  idPaciente,
}: Props) => {
  const [formData, setFormData] = useState<Omit<ExamenBioquimico, "id">>(
    initialData || defaultState
  );
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id_paciente: idPaciente,
    }));
  }, [idPaciente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editando) {
      setFormData(defaultState);
    }
  };

  const handleCancelar = () => {
    navigate("/pacientes");
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-black text-white">
          <h5 className="mb-0">
            {editando ? "Editar Examen Bioquímico" : "Nuevo Examen Bioquímico"}
          </h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {Object.entries(formData).map(([key, value]) => {
                if (key === "id_paciente") return null;
                return (
                  <Col md={6} key={key}>
                    <Form.Group controlId={key}>
                      <Form.Label className="fw-semibold">
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Form.Label>
                      <Form.Control
                        type={typeof value === "number" ? "number" : "text"}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                );
              })}
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" type="submit" className="me-2">
                {editando ? "Actualizar Examen" : "Guardar Examen"}
              </Button>
              <Button variant="secondary" type="button" onClick={handleCancelar}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ExamenesBioquimicosForm;
