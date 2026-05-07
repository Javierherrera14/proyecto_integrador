import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDatosAlimentariosByPacienteId,
  createDatosAlimentarios,
  updateDatosAlimentarios,
} from "../services/datosAlimentariosService";
import type { DatosAlimentarios } from "../types";
import DatosAlimentariosForm from "../components/Datos_Alimentarios/DatosAlimentariosForm";

const initialState: DatosAlimentarios = {
  paciente_id: 0,
  intolerancia_alimentos: false,
  alimentos_intolerancia: "",
  consumo_variable_emocional: false,
  come_tiempo_comida: false,
  frecuencia_comida: "",
  problemas_digestivos: false,
  tipo_problema_digestivo: "",
  consume_medicamentos: false,
  lista_medicamentos: "",
  toma_suplementos: false,
  agrega_sal: false,
  alimentos_no_agradan: "",
  alimentos_agradan: "",
};

export default function DatosAlimentariosPage() {
  const { paciente_id } = useParams<{ paciente_id: string }>();
  const navigate = useNavigate();
  const [datos, setDatos] = useState<DatosAlimentarios>(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const idPaciente = paciente_id ? Number(paciente_id) : 0;

  useEffect(() => {
    if (idPaciente) {
      getDatosAlimentariosByPacienteId(idPaciente)
        .then((res) => {
          if (res && Object.keys(res).length > 0) {
            setDatos(res);
            setIsEditing(true);
          } else {
            setDatos({ ...initialState, paciente_id: idPaciente });
            setIsEditing(false);
          }
        })
        .catch(() => {
          setDatos({ ...initialState, paciente_id: idPaciente });
          setIsEditing(false);
        });
    }
  }, [idPaciente]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, type, value } = e.target;
  const isCheckbox = type === "checkbox";

  setDatos((prev) => ({
    ...prev,
    [name]: isCheckbox && e.target instanceof HTMLInputElement
      ? e.target.checked
      : value,
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDatosAlimentarios(idPaciente, datos);
        alert("Datos alimentarios actualizados con éxito");
      } else {
        await createDatosAlimentarios(datos);
        alert("Datos alimentarios registrados con éxito");
      }
      navigate("/pacientes");
    } catch (error) {
      console.error("Error guardando datos:", error);
      alert("Error al guardar los datos");
    }
  };

  return (
    <DatosAlimentariosForm
      datos={datos}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEditing={isEditing}
      onCancel={() => navigate("/pacientes")}
    />
  );
}
