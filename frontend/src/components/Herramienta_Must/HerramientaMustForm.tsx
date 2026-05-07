import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert, Row, Col } from "react-bootstrap";
import type { HerramientaMustCreate } from "../../types";

interface Props {
  initialData?: HerramientaMustCreate;
  onSubmit: (data: HerramientaMustCreate) => void;
}

const HerramientaMustForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const navigate = useNavigate();

  const initialFormState: HerramientaMustCreate = initialData || {
    id_paciente: 0,
    imc: 0,
    puntaje_imc: 0,
    perdida_peso_porcentaje: 0,
    puntaje_perdida_peso: 0,
    efecto_enfermedad: false,
    puntaje_efecto_enfermedad: 0,
    puntaje_total: 0,
    clasificacion_riesgo: "",
    recomendaciones: "",
  };

  const [formData, setFormData] = useState<HerramientaMustCreate>(initialFormState);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;

    let parsedValue: any;

    if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (
      type === "number" ||
      name.includes("puntaje") ||
      name === "imc" ||
      name === "perdida_peso_porcentaje"
    ) {
      parsedValue = value === "" ? 0 : parseFloat(value);
    } else {
      parsedValue = value;
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando:", formData); // Confirmación en consola
    onSubmit(formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/pacientes");
    }, 3000);
  };

  const handleCancel = () => {
    navigate("/pacientes");
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 shadow-sm rounded bg-light">
      {showSuccess && (
        <Alert variant="success" className="text-center">
          ¡Guardado correctamente!
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>ID Paciente</Form.Label>
        <Form.Control
          type="number"
          name="id_paciente"
          value={formData.id_paciente}
          readOnly
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>IMC</Form.Label>
        <Form.Control
          type="number"
          name="imc"
          step="0.01"
          value={formData.imc}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Puntaje IMC</Form.Label>
        <Form.Select
          name="puntaje_imc"
          value={formData.puntaje_imc}
          onChange={handleChange}
        >
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>% Pérdida de Peso</Form.Label>
        <Form.Control
          type="number"
          name="perdida_peso_porcentaje"
          step="0.01"
          value={formData.perdida_peso_porcentaje}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Puntaje Pérdida de Peso</Form.Label>
        <Form.Select
          name="puntaje_perdida_peso"
          value={formData.puntaje_perdida_peso}
          onChange={handleChange}
        >
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Efecto de la Enfermedad"
          name="efecto_enfermedad"
          checked={formData.efecto_enfermedad}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Puntaje Efecto de la Enfermedad</Form.Label>
        <Form.Select
          name="puntaje_efecto_enfermedad"
          value={formData.puntaje_efecto_enfermedad}
          onChange={handleChange}
        >
          <option value={0}>0</option>
          <option value={2}>2</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Puntaje Total</Form.Label>
        <Form.Select
          name="puntaje_total"
          value={formData.puntaje_total}
          onChange={handleChange}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Clasificación del Riesgo</Form.Label>
        <Form.Control
          type="text"
          name="clasificacion_riesgo"
          value={formData.clasificacion_riesgo}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Recomendaciones</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="recomendaciones"
          value={formData.recomendaciones}
          onChange={handleChange}
        />
      </Form.Group>

      <Row>
        <Col>
          <Button variant="secondary" onClick={handleCancel} className="w-100">
            Cancelar
          </Button>
        </Col>
        <Col>
          <Button type="submit" variant="primary" className="w-100">
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default HerramientaMustForm;
