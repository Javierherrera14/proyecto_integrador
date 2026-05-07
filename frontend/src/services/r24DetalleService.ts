// src/services/r24DetalleService.ts
import axios from "axios";
import type { R24Detalle } from "../types";

const API_URL = "http://localhost:8000/r24_detalle";

export const crearR24Detalle = async (data: R24Detalle): Promise<R24Detalle> => {
  const response = await axios.post<R24Detalle>(`${API_URL}/`, data);
  return response.data;
};

export const obtenerR24Detalle = async (id: number): Promise<R24Detalle> => {
  const response = await axios.get<R24Detalle>(`${API_URL}/${id}`);
  return response.data;
};

export const actualizarR24Detalle = async (id: number, data: R24Detalle): Promise<R24Detalle> => {
  const response = await axios.put<R24Detalle>(`${API_URL}/${id}`, data);
  return response.data;
};

export const eliminarR24Detalle = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
