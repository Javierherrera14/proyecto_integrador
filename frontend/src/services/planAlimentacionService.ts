// src/services/planAlimentacionService.ts
import axios from "axios";

export interface PlanAlimentacionResponse {
  plan_alimentacion: string;
}

export const postPlanAlimentacion = async (
  pacienteId: number,
  objetivo: string
): Promise<PlanAlimentacionResponse> => {
  const response = await axios.post<PlanAlimentacionResponse>(
    "http://localhost:8000/plan",
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
