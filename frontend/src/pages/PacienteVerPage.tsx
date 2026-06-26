import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeftCircle, Download, User, Activity, FileText, ClipboardList, AlertTriangle, Stethoscope, RefreshCw, AlertCircle } from "lucide-react";
import html2pdf from "html2pdf.js";
import { usePatientStore } from "../store/patientStore";
import { HistorialPlanes } from "../components/HistorialPlanes";
import { getPacientes } from "../services/pacienteService";
import { postPlanAlimentacion } from "../services/planAlimentacionService";
import type { Paciente } from "../types";
import Modal from 'react-bootstrap/Modal';

const PacienteVerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [evaluacion, setEvaluacion] = useState<string | null>(null);
  const [antropometria, setAntropometria] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const setPacienteStore = usePatientStore((state) => state.setPaciente);
  
  // States for regenerating plan
  const [showModal, setShowModal] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const [otroObjetivo, setOtroObjetivo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const planRef = useRef<HTMLDivElement>(null);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }

      // Fetch paciente
      try {
        if (usuario?.id) {
          const pacientes = await getPacientes(usuario.id);
          const encontrado = pacientes.find(p => p.id === parseInt(id));
          if (encontrado) {
            setPaciente(encontrado);
            setPacienteStore(encontrado.id, encontrado.nombre_completo);
          }
        }
      } catch (error) {
        console.error("Error fetching paciente:", error);
      }

      // Fetch Antropometría
      try {
        const res = await fetch(`http://localhost:8000/evaluacion_antropometrica/?id_paciente=${id}`);
        if (res.ok) {
          const evals = await res.json();
          if (evals && evals.length > 0) {
            setAntropometria(evals[0]);
          }
        }
      } catch (e) {
        console.error("Error fetching antropometría:", e);
      }

      // Fetch plan activo (último)
      try {
        const res = await fetch(`http://localhost:8000/plan-alimentacion/historial/${id}`);
        if (res.ok) {
          const planes = await res.json();
          if (planes && planes.length > 0) {
            const ultimoPlan = planes[0]; 
            setPlan(ultimoPlan.contenido || ultimoPlan.plan_simplificado || ultimoPlan.plan_alimentacion || null);
            setEvaluacion(ultimoPlan.evaluacion || null);
          } else {
            setPlan(null);
            setEvaluacion(null);
          }
        }
      } catch (e) {
        console.error("Error fetching planes:", e);
      }

      setLoading(false);
    };

    fetchDatos();
  }, [id, usuario?.id]);

  const handleDownloadPDF = () => {
    if (planRef.current && paciente) {
      const opt = {
        margin: 0.5,
        filename: `Plan_Nutricional_${paciente.nombre_completo.replace(/\s+/g, '_')}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().set(opt).from(planRef.current).save();
    }
  };

  const handleOpenRegenerateModal = () => {
    setObjetivo("");
    setOtroObjetivo("");
    setErrorMensaje(null);
    setShowModal(true);
  };

  const handleRegeneratePlan = async () => {
    const objetivoFinal = objetivo === "Otro" ? otroObjetivo : objetivo;
    if (!id || !objetivoFinal.trim()) {
      setErrorMensaje("Debes seleccionar o escribir un objetivo antes de continuar.");
      return;
    }
    
    setIsGenerating(true);
    setErrorMensaje(null);

    try {
      const response = await postPlanAlimentacion(parseInt(id), objetivoFinal.trim());
      
      // Eliminamos el uso de localStorage, ya que el componente HistorialPlanes y el useEffect lo leen de la base de datos
      
      // 2. Actualizamos la variable de estado (state) del componente de forma reactiva
      setPlan(response.contenido || null);
      setEvaluacion(response.evaluacion || null);
      
      setShowModal(false);
    } catch (error: any) {
      console.error("Error al regenerar el plan:", error);
      if (error.response?.status === 429) {
        setErrorMensaje("Se ha superado el límite de peticiones a Gemini. Por favor, intenta de nuevo más tarde.");
      } else {
        setErrorMensaje("Ocurrió un error al generar el plan. El servicio podría estar no disponible temporalmente.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getBadgeColor = (clasificacion: string) => {
    if (!clasificacion) return "bg-secondary";
    const lower = clasificacion.toLowerCase();
    if (lower.includes("normal") || lower.includes("adecuado") || lower.includes("bajo riesgo")) return "bg-success";
    if (lower.includes("sobrepeso") || lower.includes("riesgo incrementado") && !lower.includes("sustancialmente")) return "bg-warning text-dark";
    if (lower.includes("obesidad") || lower.includes("sustancialmente")) return "bg-danger";
    if (lower.includes("bajo") || lower.includes("delgadez")) return "bg-info text-dark";
    return "bg-secondary";
  };

  const getClasificacionIMC = (imc: number) => {
    if (!imc) return 'Sin clasificar';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  const getClasificacionCintura = (cintura: number, sexo: string) => {
    if (!cintura || !sexo) return 'Sin clasificar';
    const s = sexo.toLowerCase();
    if (s === 'masculino') {
        if (cintura > 102) return 'Riesgo sustancialmente incrementado';
        if (cintura > 94) return 'Riesgo incrementado';
    } else if (s === 'femenino') {
        if (cintura > 88) return 'Riesgo sustancialmente incrementado';
        if (cintura > 80) return 'Riesgo incrementado';
    }
    return 'Bajo riesgo';
  };

  const quickLinks = [
    { name: "Herramienta MUST", path: `/herramienta-must/${id}`, icon: AlertTriangle, color: "text-danger", bg: "bg-danger" },
    { name: "Frecuencia de Consumo", path: `/frecuenciaConsumoAlimentos/${id}`, icon: Activity, color: "text-success", bg: "bg-success" },
    { name: "Antecedentes Patológicos", path: `/antecedentesPatologicos/${id}`, icon: Stethoscope, color: "text-primary", bg: "bg-primary" },
    { name: "Circunstancias Ambientales", path: `/circunstancias-ambientales/${id}`, icon: User, color: "text-warning", bg: "bg-warning" },
    { name: "Examen Físico", path: `/examen-fisico/${id}`, icon: User, color: "text-info", bg: "bg-info" },
    { name: "Exámenes Bioquímicos", path: `/examenes-bioquimicos/${id}`, icon: FileText, color: "text-secondary", bg: "bg-secondary" },
    { name: "Datos Alimentarios", path: `/datos-alimentariosPage/${id}`, icon: ClipboardList, color: "text-primary", bg: "bg-primary" },
    { name: "Recordatorio 24h", path: `/r24/${id}`, icon: Activity, color: "text-success", bg: "bg-success" },
  ];

  if (loading) {
    return (
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Cargando expediente del paciente...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">Paciente no encontrado</h3>
        <button className="btn btn-outline-primary mt-3 d-inline-flex align-items-center gap-2" onClick={() => navigate("/pacientes")}>
          <ArrowLeftCircle size={20} /> Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1400px' }}>
      
      {/* Header Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-light text-muted d-flex align-items-center gap-2 border-0" onClick={() => navigate("/pacientes")}>
          <ArrowLeftCircle size={20} />
          <span>Volver al Directorio</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Patient Profile & Forms */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          
          {/* Patient Card */}
          <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="card-body text-center p-4">
              <div className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3 shadow-sm" style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                {paciente.nombre_completo.charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold mb-1" style={{ color: 'var(--color-text-main)' }}>{paciente.nombre_completo}</h4>
              <p className="text-muted small mb-3">{paciente.telefono || "Sin teléfono registrado"}</p>
              
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                  {paciente.edad} años
                </span>
                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill text-capitalize">
                  {paciente.sexo}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Metrics */}
          <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="card-header bg-transparent border-bottom-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold text-muted mb-0">Métricas Clínicas Base</h6>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 text-center h-100">
                    <div className="text-muted small mb-1">Peso Actual</div>
                    <div className="fw-bold fs-5" style={{ color: 'var(--color-primary)' }}>{antropometria?.peso_actual ?? '-'} <span className="fs-6 text-muted">kg</span></div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 text-center h-100">
                    <div className="text-muted small mb-1">Talla</div>
                    <div className="fw-bold fs-5" style={{ color: 'var(--color-primary)' }}>{antropometria?.talla ?? '-'} <span className="fs-6 text-muted">cm</span></div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small mb-1">Índice de Masa Corporal</div>
                      <div className="fw-bold fs-5">{antropometria?.ind_masa_corporal ?? '-'}</div>
                    </div>
                    <span className={`badge ${getBadgeColor(paciente.clasificacion_imc || getClasificacionIMC(antropometria?.ind_masa_corporal))} rounded-pill px-3 py-2`}>
                      {paciente.clasificacion_imc || getClasificacionIMC(antropometria?.ind_masa_corporal)}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small mb-1">Cintura</div>
                      <div className="fw-bold fs-5">{antropometria?.circunferencia_cintura ?? '-'} cm</div>
                    </div>
                    <span className={`badge ${getBadgeColor(paciente.clasificacion_circunferencia || getClasificacionCintura(antropometria?.circunferencia_cintura, paciente.sexo))} rounded-pill px-3 py-2`}>
                      {paciente.clasificacion_circunferencia || getClasificacionCintura(antropometria?.circunferencia_cintura, paciente.sexo)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links / Forms */}
          <div className="card border-0 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="card-header bg-transparent border-bottom-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold text-muted mb-0">Accesos a Formularios Clínicos</h6>
            </div>
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-2">
                {quickLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <button 
                      key={idx}
                      onClick={() => navigate(link.path)}
                      className="btn btn-light text-start d-flex align-items-center gap-3 p-2 border-0 rounded-3 shadow-sm-hover transition-all"
                    >
                      <div className={`d-flex justify-content-center align-items-center rounded-circle ${link.bg} bg-opacity-10 ${link.color}`} style={{ width: '36px', height: '36px' }}>
                        <Icon size={18} />
                      </div>
                      <span className="fw-medium small" style={{ color: 'var(--color-text-main)' }}>{link.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Nutritional Plan */}
        <div className="col-lg-8">
          <div className="card border-0 rounded-4 shadow-sm h-100" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="card-header bg-transparent border-bottom p-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-main)' }}>
                <FileText size={24} color="var(--color-primary)" />
                Plan Nutricional Activo
              </h5>
              {plan && (
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-light text-primary btn-sm d-flex justify-content-center align-items-center gap-2 rounded-pill px-3 py-2 fw-medium border-0" 
                    onClick={handleOpenRegenerateModal}
                  >
                    <RefreshCw size={16} />
                    Regenerar Plan
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-sm d-flex justify-content-center align-items-center gap-2 rounded-pill px-4 py-2" 
                    onClick={handleDownloadPDF}
                  >
                    <Download size={16} />
                    Descargar PDF
                  </button>
                </div>
              )}
            </div>
            <div className="card-body p-4 p-md-5">
              {plan ? (
                <div ref={planRef} className="markdown-body" style={{ color: 'var(--color-text-main)' }}>
                  <div className="mb-4 p-3 bg-light rounded-4 border-start border-4 border-primary">
                    <ReactMarkdown>{plan}</ReactMarkdown>
                  </div>
                  {evaluacion && (
                    <>
                      <hr className="my-5" style={{ borderColor: 'var(--color-border)' }} />
                      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                        <Activity size={20} />
                        Evaluación y Recomendaciones
                      </h5>
                      <div className="p-3 bg-light rounded-4 border-start border-4 border-success">
                        <ReactMarkdown>{evaluacion}</ReactMarkdown>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="d-flex flex-column justify-content-center align-items-center h-100 py-5 text-center">
                  <div className="bg-light rounded-circle d-flex justify-content-center align-items-center mb-4" style={{ width: '100px', height: '100px', color: 'var(--color-text-muted)' }}>
                    <ClipboardList size={48} />
                  </div>
                  <h4 className="fw-bold text-muted mb-2">Aún no hay un plan generado</h4>
                  <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
                    Puedes generar el plan alimentario especificar un objetivo para este paciente.
                  </p>
                  <button 
                    className="btn d-flex justify-content-center align-items-center gap-2 rounded-pill px-4 py-2 text-white" 
                    style={{ backgroundColor: 'var(--color-primary)' }}
                    onClick={handleOpenRegenerateModal}
                  >
                    <RefreshCw size={18} />
                    Generar Nuevo Plan
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
             <HistorialPlanes />
          </div>
        </div>
        
      </div>

      {/* Modal Regenerar Plan */}
      <Modal show={showModal} onHide={() => !isGenerating && setShowModal(false)} centered backdrop={isGenerating ? "static" : true}>
        <Modal.Header closeButton={!isGenerating} className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <RefreshCw size={24} color="var(--color-primary)" />
            {plan ? "Regenerar Plan Nutricional" : "Generar Plan Nutricional"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMensaje && (
            <div className="alert alert-danger d-flex gap-2 align-items-start rounded-3 border-0 py-2 px-3 mb-4">
              <AlertCircle size={20} className="mt-1 flex-shrink-0" />
              <div className="small">{errorMensaje}</div>
            </div>
          )}

          <p className="text-muted small mb-3">Define la meta principal para el plan de nutrición del paciente <strong>{paciente?.nombre_completo}</strong>.</p>
          
          <label className="form-label fw-medium small text-muted">Objetivo Principal</label>
          <select
            className="form-select mb-3 shadow-none focus-ring focus-ring-primary border-0 bg-light"
            value={objetivo}
            onChange={(e) => {
              setObjetivo(e.target.value);
              if (e.target.value !== "Otro") setOtroObjetivo("");
            }}
            disabled={isGenerating}
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
            <div className="mb-3">
              <label className="form-label fw-medium small text-muted">Especifique el objetivo</label>
              <input
                type="text"
                className="form-control shadow-none focus-ring focus-ring-primary border-0 bg-light"
                placeholder="Ej. Reducir triglicéridos e hipertensión..."
                value={otroObjetivo}
                onChange={(e) => setOtroObjetivo(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <button 
            className="btn btn-light" 
            onClick={() => setShowModal(false)}
            disabled={isGenerating}
          >
            Cancelar
          </button>
          <button
            className="btn text-white d-flex align-items-center gap-2"
            style={{ backgroundColor: 'var(--color-primary)' }}
            onClick={handleRegeneratePlan}
            disabled={isGenerating || objetivo === "" || (objetivo === "Otro" && otroObjetivo.trim() === "")}
          >
            {isGenerating ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Generando con IA...
              </>
            ) : (
              <>
                <FileText size={18} />
                {plan ? "Regenerar Plan" : "Generar Plan"}
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default PacienteVerPage;