import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PacienteForm from '../components/Paciente/PacienteForm';
import { createPaciente, getPacientes, updatePaciente } from '../services/pacienteService';
import type { Paciente } from '../types';
import { ArrowLeftCircle, UserPlus, Edit2 } from 'lucide-react';

const PacienteFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaciente = async () => {
      setLoading(true);
      if (id) {
        try {
          const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
          if (usuario?.id) {
            const pacientes = await getPacientes(usuario.id);
            const encontrado = pacientes.find(p => p.id === parseInt(id));
            if (encontrado) setPaciente(encontrado);
          }
        } catch (error) {
          console.error("Error al cargar el paciente", error);
        }
      }
      setLoading(false);
    };
    fetchPaciente();
  }, [id]);

  const handleSubmit = async (data: Partial<Paciente>) => {
    try {
      if (paciente && paciente.id) {
        await updatePaciente(paciente.id, data);
        navigate(`/pacientes/ver/${paciente.id}`);
      } else {
        await createPaciente(data as Omit<Paciente, 'id'>);
        navigate('/pacientes');
      }
    } catch (error) {
      console.error("Error al guardar", error);
      throw error; // Para que el componente hijo atrape el error
    }
  };

  if (loading) {
    return (
      <div className="container py-5 d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Cargando formulario...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            {id ? <Edit2 size={24} color="var(--color-primary)" /> : <UserPlus size={24} color="var(--color-primary)" />}
            {id ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
          </h3>
          <p className="text-muted mb-0">Completa la información personal y antropométrica básica.</p>
        </div>
        <button className="btn btn-light text-muted d-flex align-items-center gap-2 border-0" onClick={() => navigate(id ? `/pacientes/ver/${id}` : '/pacientes')}>
          <ArrowLeftCircle size={20} /> Volver
        </button>
      </div>

      <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="card-body p-4 p-md-5">
          <PacienteForm paciente={paciente} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default PacienteFormPage;
