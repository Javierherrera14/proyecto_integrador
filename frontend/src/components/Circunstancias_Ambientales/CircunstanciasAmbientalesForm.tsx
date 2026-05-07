import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCircunstanciaAmbiental,
  getCircunstancias,
  updateCircunstanciaAmbiental,
} from "../../services/circunstanciasAmbientalesService";
import type { CircunstanciaAmbiental } from "../../types";
import { Button, Form, Spinner, Card } from "react-bootstrap";

const defaultState: CircunstanciaAmbiental = {
  id: undefined,
  id_paciente: 0,
  acalasia: false,
  alcoholismo: false,
  esclerosis_lateral_amiotrofica: false,
  demencia: false,
  abuso_drogas: false,
  trastornos_alimentacion: false,
  sindrome_guillain_barre: false,
  desordenes_mentales: false,
  distrofias_musculares: false,
  dolor: false,
  anemia_falciforme: false,
  limitaciones_economicas: false,
};

const CircunstanciasAmbientalesForm = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CircunstanciaAmbiental>(defaultState);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getCircunstancias();
        const existente = data.find((c) => c.id_paciente === parseInt(idPaciente || ""));
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
        console.error("Error al cargar circunstancias:", error);
        alert("Error al cargar circunstancias");
      } finally {
        setLoading(false);
      }
    };
    if (idPaciente) {
      cargarDatos();
    }
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
      if (editId) {
        await updateCircunstanciaAmbiental(editId, formData);
        alert("Circunstancia actualizada correctamente");
      } else {
        await createCircunstanciaAmbiental(formData);
        alert("Circunstancia creada correctamente");
      }
      navigate("/pacientes");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar circunstancia ambiental");
    }
  };

  const handleCancel = () => {
    navigate("/pacientes");
  };

  const campos = Object.entries(formData).filter(
    ([key]) => key !== "id" && key !== "id_paciente"
  );

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          {editId ? "Editar" : "Registrar"} Circunstancias Ambientales
        </h2>
        <hr />
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Card className="shadow-lg">
          <Card.Header className="bg-dark text-white fw-semibold">
            Información sobre circunstancias ambientales del paciente
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <div className="row">
                {campos.map(([key, value]) => (
                  <div className="col-md-4 mb-3" key={key}>
                    <Form.Check
                      type="checkbox"
                      id={key}
                      label={key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      name={key}
                      checked={value as boolean}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end mt-4 gap-2">
                <Button type="submit" variant="success">
                  <i className="bi bi-save me-1"></i>Guardar
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  <i className="bi bi-x-circle me-1"></i>Cancelar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CircunstanciasAmbientalesForm;
