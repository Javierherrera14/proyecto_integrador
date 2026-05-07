// src/services/FrecuenciaConsumoAlimentosService.ts
import axios from 'axios';
import type { FrecuenciaConsumoAlimentos } from '../types';

const API_URL = 'http://localhost:8000/frecuencia_consumo_alimentos';

// Crear nuevo registro
export const createFrecuenciaConsumoAlimentos = async (
  data: Omit<FrecuenciaConsumoAlimentos, 'id'>
): Promise<FrecuenciaConsumoAlimentos> => {
  const response = await axios.post<FrecuenciaConsumoAlimentos>(`${API_URL}/`, data);
  return response.data;
};

// Obtener datos por paciente (devuelve varios registros)
export const getFrecuenciaConsumoAlimentosByPaciente = async (
  idPaciente: number
): Promise<FrecuenciaConsumoAlimentos[]> => {
  const response = await axios.get<FrecuenciaConsumoAlimentos[]>(`${API_URL}/paciente/${idPaciente}`);
  return response.data;
};

// Actualizar un registro específico
export const updateFrecuenciaConsumoAlimentos = async (
  id: number,
  data: Partial<FrecuenciaConsumoAlimentos>
): Promise<FrecuenciaConsumoAlimentos> => {
  const response = await axios.put<FrecuenciaConsumoAlimentos>(`${API_URL}/${id}`, data);
  return response.data;
};

// Eliminar un registro
export const deleteFrecuenciaConsumoAlimentos = async (
  id: number
): Promise<{ message: string }> => {
  const response = await axios.delete<{ message: string }>(`${API_URL}/${id}`);
  return response.data;
};

// Obtener todos los registros (no filtrado por paciente)
export const getAllFrecuenciaConsumoAlimentos = async (): Promise<FrecuenciaConsumoAlimentos[]> => {
  const response = await axios.get<FrecuenciaConsumoAlimentos[]>(`${API_URL}/`);
  return response.data;
};

// Obtener un solo registro por su ID
export const getFrecuenciaConsumoAlimentosById = async (
  id: number
): Promise<FrecuenciaConsumoAlimentos> => {
  const response = await axios.get<FrecuenciaConsumoAlimentos>(`${API_URL}/${id}`);
  return response.data;
};
