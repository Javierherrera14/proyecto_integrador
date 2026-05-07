import axios from "axios";
import type { HerramientaMust, HerramientaMustCreate } from "../types";

const API_URL = "http://localhost:8000/herramienta_must";

export const getAllHerramientas = async (): Promise<HerramientaMust[]> => {
  const response = await axios.get<HerramientaMust[]>(API_URL);
  return response.data;
};

export const createHerramienta = async (
  data: HerramientaMustCreate
): Promise<HerramientaMust> => {
  const response = await axios.post<HerramientaMust>(API_URL, data);
  return response.data;
};


export const updateHerramienta = async (id: number, data: HerramientaMust): Promise<HerramientaMust> => {
  const response = await axios.put<HerramientaMust>(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteHerramienta = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const getHerramientaPorPaciente = async (
  id_paciente: number
): Promise<HerramientaMust | null> => {
  const response = await axios.get<HerramientaMust | null>(
    `${API_URL}/paciente/${id_paciente}`
  );
  return response.data;
};
