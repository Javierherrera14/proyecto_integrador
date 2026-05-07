import type { ExamenBioquimico } from "../types";

const API_URL = "http://127.0.0.1:8000/examenes_bioquimicos";

export const getExamenes = async (): Promise<ExamenBioquimico[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getExamenPorId = async (id: number): Promise<ExamenBioquimico> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Examen no encontrado");
  return res.json();
};

export const createExamen = async (
  examen: Omit<ExamenBioquimico, "id">
): Promise<ExamenBioquimico> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(examen),
  });
  if (!res.ok) throw new Error("Error al crear examen");
  return res.json();
};

export const updateExamen = async (
  id: number,
  data: Partial<ExamenBioquimico>
): Promise<ExamenBioquimico> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar examen");
  return res.json();
};

export const deleteExamen = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar examen");
};