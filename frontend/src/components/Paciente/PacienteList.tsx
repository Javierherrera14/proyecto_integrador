import React from 'react';
import type { Paciente } from '../../types';

interface PacienteListProps {
  pacientes: Paciente[];
  onEdit: (paciente: Paciente) => void;
  onDelete: (id: number) => void;
}

const PacienteList: React.FC<PacienteListProps> = ({ pacientes, onEdit, onDelete }) => {
  if (pacientes.length === 0) return <p>No hay pacientes registrados.</p>;

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Nombre Completo</th>
          <th>Edad</th>
          <th>Sexo</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pacientes.map((paciente) => (
          <tr key={paciente.id}>
            <td>{paciente.nombre_completo}</td>
            <td>{paciente.edad}</td>
            <td>{paciente.sexo}</td>
            <td>{paciente.telefono}</td>
            <td>{paciente.direccion}</td>
            <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => onEdit(paciente)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  if (window.confirm(`¿Eliminar paciente ${paciente.nombre_completo}?`)) {
                    onDelete(paciente.id);
                  }
                }}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PacienteList;
