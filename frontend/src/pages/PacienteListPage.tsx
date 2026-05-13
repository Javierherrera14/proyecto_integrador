import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPacientes, deletePaciente } from '../services/pacienteService';
import { postPlanAlimentacion } from '../services/planAlimentacionService';
import type { Paciente } from '../types';
import Modal from 'react-bootstrap/Modal';
import { Users, Plus, Eye, Edit2, Trash2, FileText, Search, Activity, UserX, UserPlus, ClipboardList } from 'lucide-react';

const PacienteListPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const [otroObjetivo, setOtroObjetivo] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<number | null>(null);
  const [pacienteParaEliminar, setPacienteParaEliminar] = useState<number | null>(null);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const cargarPacientes = async () => {
    if (!usuario?.id) return;
    setIsLoading(true);
    try {
      const data = await getPacientes(usuario.id);
      setPacientes(data);
    } catch (error) {
      console.error("Error al obtener pacientes", error);
    } finally {
      setIsLoading(false);
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

  const getBadgeColor = (clasificacion: string) => {
    if (!clasificacion) return "bg-secondary";
    const lower = clasificacion.toLowerCase();
    if (lower.includes("normal") || lower.includes("adecuado")) return "bg-success";
    if (lower.includes("sobrepeso")) return "bg-warning text-dark";
    if (lower.includes("obesidad") || lower.includes("riesgo")) return "bg-danger";
    if (lower.includes("bajo") || lower.includes("delgadez")) return "bg-info text-dark";
    return "bg-secondary";
  };

  const pacientesFiltrados = pacientes.filter(p => 
    p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
            <Users size={28} color="var(--color-primary)" />
            Directorio de Pacientes
          </h2>
          <p className="text-muted mb-0">Gestiona los expedientes y planes nutricionales.</p>
        </div>
        <button 
          className="btn d-flex align-items-center gap-2 px-4 py-2" 
          onClick={handleNuevoPaciente}
          style={{ backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 500 }}
        >
          <UserPlus size={20} />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      {/* Tarjeta principal con tabla */}
      <div className="card border-0 rounded-4 shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="card-header bg-white border-bottom p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h5 className="mb-0 fw-semibold" style={{ color: 'var(--color-text-main)' }}>Todos los Pacientes</h5>
          
          {/* Buscador visual */}
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-light border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0 ps-0 focus-ring focus-ring-primary"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ boxShadow: 'none' }}
            />
          </div>
        </div>

        <div className="card-body p-0">
          {isLoading ? (
            <div className="d-flex flex-column justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="text-muted">Cargando directorio...</p>
            </div>
          ) : pacientesFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-inline-flex justify-content-center align-items-center bg-light rounded-circle mb-3" style={{ width: '80px', height: '80px', color: 'var(--color-text-muted)' }}>
                <UserX size={40} />
              </div>
              <h5 className="fw-semibold text-muted">No se encontraron pacientes</h5>
              <p className="text-muted small">Intenta con otro término de búsqueda o agrega un paciente nuevo.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3 text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>PACIENTE</th>
                    <th className="py-3 text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>DATOS CLÍNICOS</th>
                    <th className="py-3 text-muted fw-semibold text-center" style={{ fontSize: '0.85rem' }}>IMC / CINTURA</th>
                    <th className="px-4 py-3 text-muted fw-semibold text-end" style={{ fontSize: '0.85rem' }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '40px', height: '40px', color: 'var(--color-primary)', backgroundColor: '#f0fdfa' }}>
                            {p.nombre_completo.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold" style={{ color: 'var(--color-text-main)' }}>{p.nombre_completo}</div>
                            <div className="text-muted small">{p.telefono || 'Sin teléfono'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-muted small">
                          <span className="fw-medium text-dark">{p.edad} años</span> • <span className="text-capitalize">{p.sexo}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="d-flex flex-column align-items-center gap-1">
                          <span className={`badge ${getBadgeColor(p.clasificacion_imc || '')} rounded-pill px-2 py-1 fw-medium`} style={{ fontSize: '0.75rem' }}>
                            IMC: {p.ind_masa_corporal ?? '-'}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.7rem' }}>Cintura: {p.circunferencia_cintura ?? '-'}cm</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-sm btn-light text-primary border-0" onClick={() => handleVerPlan(p.id)} title="Generar Plan Alimenticio">
                            <Activity size={18} />
                          </button>
                          <button className="btn btn-sm btn-light text-secondary border-0" onClick={() => handleEdit(p.id)} title="Editar Paciente">
                            <Edit2 size={18} />
                          </button>
                          
                          {/* Dropdown de formularios */}
                          <div className="dropdown d-inline-block">
                            <button className="btn btn-sm btn-light text-secondary border-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" title="Formularios Clínicos">
                              <ClipboardList size={18} />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 p-2" style={{ fontSize: '0.9rem' }}>
                              <li><h6 className="dropdown-header">Evaluaciones Médicas</h6></li>
                              <li><button className="dropdown-item rounded-2" onClick={() => navigate(`/herramienta-must/${p.id}`)}>Herramienta MUST</button></li>
                              <li><button className="dropdown-item rounded-2" onClick={() => navigate(`/frecuenciaConsumoAlimentos/${p.id}`)}>Frecuencia de Consumo</button></li>
                              <li><button className="dropdown-item rounded-2" onClick={() => navigate(`/antecedentesPatologicos/${p.id}`)}>Antecedentes Patológicos</button></li>
                              <li><button className="dropdown-item rounded-2" onClick={() => navigate(`/circunstancias-ambientales/${p.id}`)}>Circunstancias Ambientales</button></li>
                              <li><button className="dropdown-item rounded-2" onClick={() => navigate(`/examen-fisico/${p.id}`)}>Examen Físico</button></li>
                              <li><button className="dropdown-item rounded-2" onClick={() => navigate(`/examenes-bioquimicos/${p.id}`)}>Exámenes Bioquímicos</button></li>
                              <li><button className="dropdown-item rounded-2" onClick={() => navigate(`/datos-alimentariosPage/${p.id}`)}>Datos Alimentarios</button></li>
                              <li><button className="dropdown-item rounded-2" onClick={() => navigate(`/r24/${p.id}`)}>Recordatorio 24h (R24)</button></li>
                            </ul>
                          </div>

                          <button className="btn btn-sm btn-light text-danger border-0" onClick={() => handleDeleteRequest(p.id)} title="Eliminar Paciente">
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Menú temporal para eliminar */}
                        {pacienteParaEliminar === p.id && (
                          <div className="mt-2 text-end d-flex justify-content-end gap-1">
                            <button className="btn btn-danger btn-sm rounded-pill" style={{ fontSize: '0.75rem' }} onClick={() => handleEliminar(p.id, true)}>Eliminar Permanente</button>
                            <button className="btn btn-warning text-dark btn-sm rounded-pill" style={{ fontSize: '0.75rem' }} onClick={() => handleEliminar(p.id, false)}>Desactivar</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para seleccionar objetivo del plan */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Objetivo del Plan Alimentario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">Define la meta principal para el plan de nutrición de este paciente.</p>
          <select
            className="form-select mb-3 shadow-none focus-ring focus-ring-primary"
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
              className="form-control shadow-none focus-ring focus-ring-primary"
              placeholder="Escriba su objetivo personalizado"
              value={otroObjetivo}
              onChange={(e) => setOtroObjetivo(e.target.value)}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <button className="btn btn-light" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button
            className="btn text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
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
