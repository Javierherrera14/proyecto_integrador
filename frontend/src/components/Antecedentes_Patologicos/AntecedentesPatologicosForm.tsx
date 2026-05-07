import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAntecedente,
  getAntecedentes,
  updateAntecedente,
} from "../../services/antecedentesPatologicosService";
import type { AntecedentePatologico } from "../../types";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

const defaultState: AntecedentePatologico = {
  id: undefined,
  id_paciente: 0,
  hipertension_personal: false,
  hipercolesterolemia_personal: false,
  diabetes_personal: false,
  hipertrigliceridemia_personal: false,
  obesidad_personal: false,
  enfermedad_cardiovascular_personal: false,
  enfermedad_renal_personal: false,
  enfermedad_gastrointestinal_personal: false,
  hipertension_familiar: false,
  hipercolesterolemia_familiar: false,
  diabetes_familiar: false,
  hipertrigliceridemia_familiar: false,
  obesidad_familiar: false,
  enfermedad_cardiovascular_familiar: false,
  enfermedad_renal_familiar: false,
  enfermedad_gastrointestinal_familiar: false,
  quirurgicos: "",
};

const AntecedentesPatologicosForm = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AntecedentePatologico>(defaultState);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getAntecedentes();
        const existente = data.find(
          (a) => a.id_paciente === parseInt(idPaciente || "")
        );
        if (existente) {
          setFormData(existente);
          setEditId(existente.id ?? null);
        } else {
          setFormData((prev) => ({
            ...prev,
            id_paciente: parseInt(idPaciente || ""),
          }));
        }
      } catch (error) {
        alert("Error al cargar los antecedentes");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (idPaciente) {
      cargarDatos();
    }
  }, [idPaciente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateAntecedente(editId, formData);
        alert("Antecedente actualizado exitosamente");
      } else {
        await createAntecedente(formData);
        alert("Antecedente creado exitosamente");
      }
      navigate("/pacientes");
    } catch (error) {
      alert("Error al guardar el antecedente");
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate("/pacientes");
  };

  const renderCheckboxGroup = (title: string, keys: string[]) => (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-dark text-white">{title}</Card.Header>
      <Card.Body>
        <Row>
          {keys.map((key) => (
            <Col md={6} key={key} className="mb-2">
              <Form.Check
                type="checkbox"
                id={key}
                name={key}
                label={key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                checked={formData[key as keyof AntecedentePatologico] as boolean}
                onChange={handleChange}
              />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );

  const personales = Object.keys(formData).filter((key) =>
    key.endsWith("_personal")
  );
  const familiares = Object.keys(formData).filter((key) =>
    key.endsWith("_familiar")
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-secondary">
        {editId ? "Editar" : "Registrar"} Antecedentes Patológicos
      </h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          {renderCheckboxGroup("Antecedentes Personales", personales)}
          {renderCheckboxGroup("Antecedentes Familiares", familiares)}

          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-dark text-white">Antecedentes Quirúrgicos</Card.Header>
            <Card.Body>
              <Form.Group controlId="quirurgicos">
                <Form.Label>Describa los antecedentes quirúrgicos</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="quirurgicos"
                  value={formData.quirurgicos}
                  onChange={handleChange}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-end gap-2">
            <Button type="submit" variant="primary">
              Guardar
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default AntecedentesPatologicosForm;
