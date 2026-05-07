import axios from "axios";
import type { R24 } from "../types";

const API_URL = "http://localhost:8000/r24";

export const crearR24 = async (data: R24): Promise<R24> => {
  const response = await axios.post<R24>(`${API_URL}/`, data);
  return response.data;
};

export const obtenerR24 = async (id: number): Promise<R24> => {
  const response = await axios.get<R24>(`${API_URL}/${id}`);
  return response.data;
};

export const actualizarR24 = async (id: number, data: R24): Promise<R24> => {
  const response = await axios.put<R24>(`${API_URL}/${id}`, data);
  return response.data;
};

export const eliminarR24 = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
