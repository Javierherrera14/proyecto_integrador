import React from "react";
import { Table, Button } from "react-bootstrap";
import type { FrecuenciaConsumoAlimentos } from "../../types";

interface Props {
  items: FrecuenciaConsumoAlimentos[];
  onEdit: (item: FrecuenciaConsumoAlimentos) => void;
  onDelete: (id: number) => void;
}

const FrecuenciaConsumoAlimentosList: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  if (!items || !Array.isArray(items)) {
    return <div>No hay datos para mostrar</div>;
  }

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>ID Paciente</th>
          <th>Grupo</th>
          <th>Alimento</th>
          <th>Consume Sí</th>
          <th>Consume No</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.id_paciente}</td>
            <td>{item.grupo_alimentos}</td>
            <td>{item.alimento}</td>
            <td>{item.consume_si ? "✔️" : "❌"}</td>
            <td>{item.consume_no ? "✔️" : "❌"}</td>
            <td>
              <Button variant="warning" size="sm" onClick={() => onEdit(item)} className="me-2">
                Editar
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(item.id)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default FrecuenciaConsumoAlimentosList;
