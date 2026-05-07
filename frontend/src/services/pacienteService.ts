import axios from 'axios';
import type { Paciente } from '../types';

const API_URL = 'http://localhost:8000/pacientes/';

// ✅ Obtener pacientes del usuario actual
export const getPacientes = async (usuarioId: number): Promise<Paciente[]> => {
  const response = await axios.get<Paciente[]>(`${API_URL}?usuario_id=${usuarioId}`);
  return response.data;
};

// ✅ Crear paciente con usuario_id incluido
export const createPaciente = async (paciente: Partial<Paciente>): Promise<Paciente> => {
  const {
    nombre_completo,
    edad,
    sexo,
    telefono,
    direccion,
    peso_actual,
    peso_usual,
    talla,
    circunferencia_cintura,
    ind_masa_corporal,
    usuario_id
  } = paciente;

  const payload = {
    nombre_completo,
    edad,
    sexo,
    telefono,
    direccion,
    peso_actual,
    peso_usual,
    talla,
    circunferencia_cintura,
    ind_masa_corporal,
    usuario_id
  };
  

  const response = await axios.post<Paciente>(API_URL, payload);
  return response.data;
};

export const updatePaciente = async (id: number, data: Partial<Paciente>): Promise<Paciente> => {
  const response = await axios.put<Paciente>(`${API_URL}${id}`, data);
  return response.data;
};

export const deletePaciente = async (id: number, eliminarDefinitivo = false): Promise<void> => {
  await axios.delete(`http://localhost:8000/pacientes/${id}?eliminar_definitivo=${eliminarDefinitivo}`);
};


