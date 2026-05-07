import axios from "axios";
import type { DatosAlimentarios } from "../types";

const API_URL = "http://localhost:8000/datos_alimentarios";

export const getDatosAlimentariosByPacienteId = async (
  paciente_id: number
): Promise<DatosAlimentarios> => {
  const response = await axios.get<DatosAlimentarios>(`${API_URL}/${paciente_id}`);
  return response.data;
};

export const createDatosAlimentarios = async (
  datos: DatosAlimentarios
): Promise<DatosAlimentarios> => {
  const response = await axios.post<DatosAlimentarios>(API_URL, datos);
  return response.data;
};

export const updateDatosAlimentarios = async (
  paciente_id: number,
  datos: DatosAlimentarios
): Promise<DatosAlimentarios> => {
  const response = await axios.put<DatosAlimentarios>(`${API_URL}/${paciente_id}`, datos);
  return response.data;
};
