import type { ExamenBioquimico } from "../../types";

interface Props {
  examenes: ExamenBioquimico[];
  onEditar: (examen: ExamenBioquimico) => void;
  onEliminar: (id: number) => void;
}

const ExamenesBioquimicosList = ({ examenes, onEditar, onEliminar }: Props) => {
  if (examenes.length === 0) return <p>No hay exámenes registrados.</p>;

  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Paciente</th>
            <th>Hemoglobina Glicada</th>
            <th>Glicemia Basal</th>
            <th>Colesterol Total</th>
            <th>HDL</th>
            <th>LDL</th>
            <th>Triglicéridos</th>
            <th>Creatinina</th>
            <th colSpan={7}>Interpretaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {examenes.map((ex) => (
            <tr key={ex.id}>
              <td>{ex.id}</td>
              <td>{ex.id_paciente}</td>
              <td>{ex.hemoglobina_glicada}</td>
              <td>{ex.glicemia_basal}</td>
              <td>{ex.colesterol_total}</td>
              <td>{ex.colesterol_hdl}</td>
              <td>{ex.colesterol_ldl}</td>
              <td>{ex.trigliceridos}</td>
              <td>{ex.creatinina}</td>
              <td>{ex.interpretacion_hemoglobina}</td>
              <td>{ex.interpretacion_glicemia}</td>
              <td>{ex.interpretacion_colesterol_total}</td>
              <td>{ex.interpretacion_colesterol_hdl}</td>
              <td>{ex.interpretacion_colesterol_ldl}</td>
              <td>{ex.interpretacion_trigliceridos}</td>
              <td>{ex.interpretacion_creatinina}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-1"
                  onClick={() => onEditar(ex)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onEliminar(ex.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamenesBioquimicosList;