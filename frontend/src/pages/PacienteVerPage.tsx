// src/pages/PacienteVerPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeftCircle, Download } from "lucide-react";
import html2pdf from "html2pdf.js";

const PacienteVerPage: React.FC = () => {
  const params = useParams();
  const id = params.id ?? null;
  const navigate = useNavigate();
  const [plan, setPlan] = useState<string | null>(null);
  const [evaluacion, setEvaluacion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const planRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      setPlan(null);
      setEvaluacion(null);
      setLoading(false);
      return;
    }

    const planGuardado = localStorage.getItem("planAlimentacionGenerado");

if (planGuardado) {
  try {
    const parsed = JSON.parse(planGuardado);
    setPlan(parsed.plan_simplificado ?? null);
    setEvaluacion(parsed.evaluacion ?? null);
  } catch {
    setPlan(null);
    setEvaluacion(null);
  }
  localStorage.removeItem("planAlimentacionGenerado");
}

    setLoading(false);
  }, [id]);

  const handleDownloadPDF = () => {
    if (planRef.current) {
      const opt = {
        margin: 0.5,
        filename: `plan_nutricional_paciente_${id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().set(opt).from(planRef.current).save();
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📝 Plan Nutricional del Paciente</h4>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-light" onClick={handleDownloadPDF}>
              <Download className="me-2" size={20} />
              Descargar PDF
            </button>
            <button className="btn btn-outline-light" onClick={() => navigate("/pacientes")}>
              <ArrowLeftCircle className="me-2" size={20} />
              Volver
            </button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-3">Cargando plan alimentario...</p>
            </div>
          ) : plan ? (
            <div ref={planRef} className="markdown-body">
              <ReactMarkdown>{plan}</ReactMarkdown>
              {evaluacion && (
                <>
                  <hr />
                  <h5>📊 Evaluación del Plan</h5>
                  <ReactMarkdown>{evaluacion}</ReactMarkdown>
                </>
              )}
            </div>
          ) : (
            <div className="alert alert-warning text-center">
              ⚠️ No se encontró un plan alimentario para este paciente. Puedes generarlo desde la lista de pacientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacienteVerPage;
