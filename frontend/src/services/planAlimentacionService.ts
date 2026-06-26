// src/services/planAlimentacionService.ts
import axios from "axios";

export interface PlanAlimentacionResponse {
  id: number;
  id_paciente: number;
  objetivo: string;
  contenido: string;
  evaluacion?: string | null;
  fecha_creacion: string;
}

export const postPlanAlimentacion = async (
  pacienteId: number,
  objetivo: string
): Promise<PlanAlimentacionResponse> => {
  const response = await axios.post<any>(
    "http://localhost:8000/plan-alimentacion/generar",
    {
      paciente_id: pacienteId,
      objetivo: objetivo,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
