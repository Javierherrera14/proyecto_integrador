import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPacientes, deletePaciente } from '../services/pacienteService';
import { postPlanAlimentacion } from '../services/planAlimentacionService';
import type { Paciente } from '../types';
import Modal from 'react-bootstrap/Modal';

const PacienteListPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const [otroObjetivo, setOtroObjetivo] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<number | null>(null);
  const [pacienteParaEliminar, setPacienteParaEliminar] = useState<number | null>(null);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const cargarPacientes = async () => {
    if (!usuario?.id) return;
    try {
      const data = await getPacientes(usuario.id);
      setPacientes(data);
    } catch (error) {
      console.error("Error al obtener pacientes", error);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/pacientes/editar/${id}`);
  };

  const handleDeleteRequest = (id: number) => {
    setPacienteParaEliminar(id === pacienteParaEliminar ? null : id); // alterna visibilidad
  };

  const handleEliminar = async (id: number, definitivo: boolean) => {
    try {
      await deletePaciente(id, definitivo);
      cargarPacientes();
      setPacienteParaEliminar(null);
    } catch (error) {
      console.error("Error al eliminar paciente", error);
    }
  };

  const handleNuevoPaciente = () => {
    navigate('/pacientes/nuevo');
  };

  const handleVerPlan = (id: number) => {
    setPacienteSeleccionado(id);
    setObjetivo("");
    setOtroObjetivo("");
    setShowModal(true);
  };

  const handleGenerarPlan = async (objetivoFinal: string) => {
  if (!pacienteSeleccionado || !objetivoFinal.trim()) {
    alert("Debes seleccionar o escribir un objetivo antes de continuar.");
    return;
  }
  try {
    const response = await postPlanAlimentacion(pacienteSeleccionado, objetivoFinal.trim());
    // Guardar el objeto completo
    localStorage.setItem("planAlimentacionGenerado", JSON.stringify(response));
    navigate(`/pacientes/ver/${pacienteSeleccionado}`);
  } catch (error) {
    console.error("Error generando el plan", error);
    alert("Ocurrió un error al generar el plan.");
  } finally {
    setShowModal(false);
  }
};


  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <i className="bi bi-people-fill me-2"></i>Lista de Pacientes
        </h2>
        <button className="btn btn-success" onClick={handleNuevoPaciente}>
          <i className="bi bi-plus-circle me-1"></i>Nuevo Paciente
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle rounded-3 overflow-hidden">
          <thead className="table-dark text-center">
            <tr>
              <th>Ver</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Teléfono</th>
              <th>IMC</th>
              <th>Clasificación IMC</th>
              <th>Cintura (cm)</th>
              <th>Clasificación Cintura</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td className="text-center">
                  <button className="btn btn-info btn-sm" onClick={() => handleVerPlan(p.id)}>
                    <i className="bi bi-eye-fill"></i>
                  </button>
                </td>
                <td>{p.nombre_completo}</td>
                <td className="text-center">{p.edad}</td>
                <td className="text-capitalize text-center">{p.sexo}</td>
                <td className="text-center">{p.telefono}</td>
                <td className="text-center">{p.ind_masa_corporal ?? '-'}</td>
                <td className="text-center">{p.clasificacion_imc ?? '-'}</td>
                <td className="text-center">{p.circunferencia_cintura ?? '-'}</td>
                <td className="text-center">{p.clasificacion_circunferencia ?? '-'}</td>
                <td>
                  <div className="d-flex flex-column gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(p.id)}>
                      <i className="bi bi-pencil-square me-1"></i>Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteRequest(p.id)}
                    >
                      <i className="bi bi-trash-fill me-1"></i>Eliminar
                    </button>

                    {pacienteParaEliminar === p.id && (
                      <div className="d-flex flex-column gap-1">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleEliminar(p.id, true)}
                        >
                          Eliminar Permanente
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => handleEliminar(p.id, false)}
                        >
                          Desactivar
                        </button>
                      </div>
                    )}

                    <div className="dropdown">
                      <button
                        className="btn btn-outline-secondary btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        Formularios
                      </button>
                      <ul className="dropdown-menu" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        <li><button className="dropdown-item" onClick={() => navigate(`/herramienta-must/${p.id}`)}>MUST</button></li>
                        <li><button className="dropdown-item" onClick={() => navigate(`/frecuenciaConsumoAlimentos/${p.id}`)}>Frecuencia</button></li>
                        <li><button className="dropdown-item" onClick={() => navigate(`/antecedentesPatologicos/${p.id}`)}>Patológicos</button></li>
                        <li><button className="dropdown-item" onClick={() => navigate(`/circunstancias-ambientales/${p.id}`)}>Ambientales</button></li>
                        <li><button className="dropdown-item" onClick={() => navigate(`/examen-fisico/${p.id}`)}>Examen Físico</button></li>
                        <li><button className="dropdown-item" onClick={() => navigate(`/examenes-bioquimicos/${p.id}`)}>Bioquímicos</button></li>
                        <li><button className="dropdown-item" onClick={() => navigate(`/datos-alimentariosPage/${p.id}`)}>Alimentarios</button></li>
                        <li><button className="dropdown-item" onClick={() => navigate(`/r24/${p.id}`)}>R24</button></li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para seleccionar objetivo del plan */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Objetivo del Plan Alimentario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-select mb-3"
            value={objetivo}
            onChange={(e) => {
              setObjetivo(e.target.value);
              if (e.target.value !== "Otro") setOtroObjetivo("");
            }}
          >
            <option value="">Seleccione un objetivo...</option>
            <option value="Bajar de peso">Bajar de peso</option>
            <option value="Controlar azúcar">Controlar azúcar</option>
            <option value="Mejorar digestión">Mejorar digestión</option>
            <option value="Aumentar masa muscular">Aumentar masa muscular</option>
            <option value="Mantener peso saludable">Mantener peso saludable</option>
            <option value="Otro">Otro...</option>
          </select>

          {objetivo === "Otro" && (
            <input
              type="text"
              className="form-control"
              placeholder="Escriba su objetivo personalizado"
              value={otroObjetivo}
              onChange={(e) => setOtroObjetivo(e.target.value)}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const objetivoFinal = objetivo === "Otro" ? otroObjetivo : objetivo;
              handleGenerarPlan(objetivoFinal);
            }}
            disabled={objetivo === "" || (objetivo === "Otro" && otroObjetivo.trim() === "")}
          >
            Generar Plan
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PacienteListPage;
