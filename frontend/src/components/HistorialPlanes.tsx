import React, { useEffect, useState } from 'react';
import { usePatientStore } from '../store/patientStore';

interface PlanNutricional {
  id: number;
  id_paciente: number;
  objetivo: string;
  contenido: string;
  fecha_creacion: string;
}

export const HistorialPlanes: React.FC = () => {
  const { pacienteId, nombreCompleto } = usePatientStore();
  const [planes, setPlanes] = useState<PlanNutricional[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pacienteId) return;

    const fetchPlanes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ajusta el puerto si tu backend corre en uno diferente
        const response = await fetch(`http://localhost:8000/plan-alimentacion/historial/${pacienteId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el historial de planes');
        }
        const data = await response.json();
        setPlanes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, [pacienteId]);

  if (!pacienteId) {
    return (
      <div style={{ padding: '1rem', color: '#6b7280', textAlign: 'center', marginTop: '2rem' }}>
        Selecciona un paciente activo para ver su historial de planes nutricionales.
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1d4ed8' }}>
        Historial de Planes Nutricionales - {nombreCompleto}
      </h2>

      {loading && <p style={{ color: '#4b5563' }}>Cargando historial desde la base de datos...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      
      {!loading && planes.length === 0 && !error && (
        <p style={{ color: '#6b7280' }}>No hay planes nutricionales registrados para este paciente.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {planes.map((plan) => (
          <div key={plan.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#f9fafb' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1f2937' }}>
                Objetivo: {plan.objetivo}
              </span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                {new Date(plan.fecha_creacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {/* Visualizador de texto plano respetando saltos de línea (Markdown compatible) */}
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.25rem', border: '1px solid #e5e7eb', marginTop: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit', margin: 0, color: '#374151', lineHeight: '1.6' }}>
                {plan.contenido}
              </pre>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};
