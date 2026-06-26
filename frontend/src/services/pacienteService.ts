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
    usuario_id,
    
    // Campos que ahora van a otra tabla
    peso_actual,
    peso_usual,
    talla,
    circunferencia_cintura,
    ind_masa_corporal
  } = paciente;

  const pacientePayload = {
    nombre_completo,
    edad,
    sexo,
    telefono,
    direccion,
    usuario_id
  };
  
  // 1. Crear el paciente
  const response = await axios.post<Paciente>(API_URL, pacientePayload);
  const nuevoPaciente = response.data;

  // 2. Crear su evaluación antropométrica inicial
  if (peso_actual || talla || circunferencia_cintura) {
    const antropometriaPayload = {
      id_paciente: nuevoPaciente.id,
      peso_actual: peso_actual || 0,
      peso_usual: peso_usual || 0,
      talla: talla || 0,
      circunferencia_cintura: circunferencia_cintura || 0,
      ind_masa_corporal: ind_masa_corporal || 0
    };
    try {
      await axios.post('http://localhost:8000/evaluacion_antropometrica/', antropometriaPayload);
    } catch (e) {
      console.error("Error al guardar antropometría inicial", e);
    }
  }

  return nuevoPaciente;
};

export const updatePaciente = async (id: number, data: Partial<Paciente>): Promise<Paciente> => {
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
    ind_masa_corporal
  } = data;

  const pacientePayload = {
    nombre_completo,
    edad,
    sexo,
    telefono,
    direccion
  };

  // 1. Actualizar el paciente
  const response = await axios.put<Paciente>(`${API_URL}${id}`, pacientePayload);
  
  // 2. Crear una nueva evaluación antropométrica si vienen datos
  if (peso_actual !== undefined || talla !== undefined) {
    const antropometriaPayload = {
      id_paciente: id,
      peso_actual: peso_actual || 0,
      peso_usual: peso_usual || 0,
      talla: talla || 0,
      circunferencia_cintura: circunferencia_cintura || 0,
      ind_masa_corporal: ind_masa_corporal || 0
    };
    try {
      await axios.post('http://localhost:8000/evaluacion_antropometrica/', antropometriaPayload);
    } catch (e) {
      console.error("Error al actualizar antropometría", e);
    }
  }

  return response.data;
};

export const deletePaciente = async (id: number, eliminarDefinitivo = false): Promise<void> => {
  await axios.delete(`http://localhost:8000/pacientes/${id}?eliminar_definitivo=${eliminarDefinitivo}`);
};


