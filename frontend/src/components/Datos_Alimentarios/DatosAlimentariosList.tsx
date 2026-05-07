import { useEffect, useState } from "react";
import { getDatosAlimentarios, deleteDatoAlimentario } from "../../services/datosAlimentariosService";
import type { DatosAlimentarios } from "../../types";
import { useNavigate } from "react-router-dom";

const DatosAlimentariosList = () => {
  const [datos, setDatos] = useState<DatosAlimentarios[]>([]);
  const navigate = useNavigate();

  const fetchDatos = async () => {
    try {
      const data = await getDatosAlimentarios();
      setDatos(data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleEditar = (id: number) => {
    navigate(`/datos_alimentarios/form/${id}`);
  };

  const handleAgregar = () => {
    navigate("/datos_alimentarios/form");
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Deseas eliminar este registro?")) return;
    await deleteDatoAlimentario(id);
    fetchDatos();
  };

  return (
    <div className="container mt-4">
      <h3>Datos Alimentarios</h3>
      <button className="btn btn-primary mb-3" onClick={handleAgregar}>
        ➕ Agregar Nuevo
      </button>
      {datos.length === 0 ? (
        <p>No hay datos registrados.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Paciente</th>
              <th>Intolerancia</th>
              <th>Frecuencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.id_paciente}</td>
                <td>{item.intolerancia_alimentos ? "✅" : "❌"}</td>
                <td>{item.frecuencia_comida}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleEditar(item.id!)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(item.id!)}>
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

export default DatosAlimentariosList;