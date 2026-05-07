// src/components/Examen_Fisico/ExamenFisicoList.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExamenesFisicos,
  deleteExamenFisico,
} from "../../services/examenFisicoService";
import type { ExamenFisico } from "../../types";

const ExamenFisicoList = () => {
  const [examenes, setExamenes] = useState<ExamenFisico[]>([]);
  const navigate = useNavigate();

  const fetchExamenes = async () => {
    try {
      const data = await getExamenesFisicos();
      setExamenes(data);
    } catch (error) {
      console.error("Error al cargar exámenes físicos:", error);
    }
  };

  useEffect(() => {
    fetchExamenes();
  }, []);

  const handleEditar = (id: number) => {
    navigate(`/examen-fisico/form/${id}`);
  };

  const handleAgregar = () => {
    navigate("/examen-fisico/form");
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Deseas eliminar este registro?")) return;
    await deleteExamenFisico(id);
    fetchExamenes();
  };

  return (
    <div className="container mt-4">
      <h3>Exámenes Físicos</h3>
      <button className="btn btn-primary mb-3" onClick={handleAgregar}>
        ➕ Agregar Nuevo
      </button>
      {examenes.length === 0 ? (
        <p>No hay exámenes registrados.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Paciente</th>
              <th>Petequias</th>
              <th>Dermatitis</th>
              <th>Pelagra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {examenes.map((ex) => (
              <tr key={ex.id}>
                <td>{ex.id}</td>
                <td>{ex.id_paciente}</td>
                <td>{ex.petequias ? "✅" : "❌"}</td>
                <td>{ex.dermatitis ? "✅" : "❌"}</td>
                <td>{ex.pelagra ? "✅" : "❌"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => handleEditar(ex.id!)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(ex.id!)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamenFisicoList;
