// src/components/R24Detalle/R24DetalleForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearR24Detalle, obtenerR24Detalle, actualizarR24Detalle } from "../../services/r24DetalleService";
import type { R24Detalle } from "../../types";
import { Button, Form } from "react-bootstrap";

interface Props {
  idR24: number;
}

const R24DetalleForm: React.FC<Props> = ({ idR24 }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<R24Detalle>({
    id_r24: idR24,
    tiempo_comida: "",
    lugar: "",
    hora: "",
    preparacion: "",
    alimento_id: undefined,
    medida_casera: "",
    gramos_consumidos: undefined,
  });

  useEffect(() => {
    if (id) {
      obtenerR24Detalle(parseInt(id)).then(data => setFormData(data));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "gramos_consumidos" || name === "alimento_id" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await actualizarR24Detalle(parseInt(id), formData);
      } else {
        await crearR24Detalle(formData);
      }
      setTimeout(() => navigate("/pacientes"), 3000);
    } catch (error) {
      console.error("Error al guardar detalle:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Detalle R24" : "Nuevo Detalle R24"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tiempo de comida</Form.Label>
          <Form.Control
            type="text"
            name="tiempo_comida"
            value={formData.tiempo_comida}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Lugar</Form.Label>
          <Form.Control
            type="text"
            name="lugar"
            value={formData.lugar || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hora</Form.Label>
          <Form.Control
            type="time"
            name="hora"
            value={formData.hora || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Preparación</Form.Label>
          <Form.Control
            as="textarea"
            name="preparacion"
            value={formData.preparacion || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ID del Alimento</Form.Label>
          <Form.Control
            type="number"
            name="alimento_id"
            value={formData.alimento_id || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Medida casera</Form.Label>
          <Form.Control
            type="text"
            name="medida_casera"
            value={formData.medida_casera || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gramos consumidos</Form.Label>
          <Form.Control
            type="number"
            name="gramos_consumidos"
            value={formData.gramos_consumidos || ""}
            onChange={handleChange}
            step="0.1"
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

export default R24DetalleForm;
