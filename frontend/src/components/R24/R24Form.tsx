import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearR24, obtenerR24, actualizarR24 } from "../../services/r24Service";
import type { R24 } from "../../types";
import { Button, Form } from "react-bootstrap";

interface Props {
  idPaciente?: number;
}

const R24Form: React.FC<Props> = ({ idPaciente }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<R24>({
    id_paciente: idPaciente ?? 0,
    fecha: "",
    observaciones: "",
  });

  useEffect(() => {
    if (id) {
      obtenerR24(parseInt(id)).then((data) => setFormData(data));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id_paciente" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await actualizarR24(parseInt(id), formData);
      } else {
        await crearR24(formData);
      }
      setTimeout(() => navigate("/pacientes"), 3000);
    } catch (error) {
      console.error("Error al guardar R24:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Registro R24" : "Nuevo Registro R24"}</h2>
      <Form onSubmit={handleSubmit}>
        {!id && (
          <Form.Group controlId="id_paciente" className="mb-3">
            <Form.Label>ID del Paciente</Form.Label>
            <Form.Control
              type="number"
              name="id_paciente"
              value={formData.id_paciente}
              onChange={handleChange}
              readOnly={!!idPaciente}
              required
            />
          </Form.Group>
        )}
        <Form.Group controlId="fecha" className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="observaciones" className="mb-3">
          <Form.Label>Observaciones</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="observaciones"
            value={formData.observaciones || ""}
            onChange={handleChange}
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate("/pacientes")}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default R24Form;
