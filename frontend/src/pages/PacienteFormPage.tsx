import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PacienteForm from '../components/Paciente/PacienteForm';
import { createPaciente, getPacientes, updatePaciente } from '../services/pacienteService';
import type { Paciente } from '../types';

const PacienteFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | undefined>(undefined);

  useEffect(() => {
    const fetchPaciente = async () => {
      if (id) {
        try {
          const pacientes = await getPacientes();
          const encontrado = pacientes.find(p => p.id === parseInt(id));
          if (encontrado) setPaciente(encontrado);
        } catch (error) {
          console.error("Error al cargar el paciente", error);
        }
      }
    };
    fetchPaciente();
  }, [id]);

  const handleSubmit = async (data: Partial<Paciente>) => {
    try {
      if (paciente && paciente.id) {
        await updatePaciente(paciente.id, data);
      } else {
        await createPaciente(data as Omit<Paciente, 'id'>);
      }
      navigate('/pacientes');
    } catch (error) {
      console.error("Error al guardar", error);
    }
  };

  return (
    <div className="container py-4">
      <h2>{id ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
      <PacienteForm paciente={paciente} onSubmit={handleSubmit} />
    </div>
  );
};

export default PacienteFormPage;
