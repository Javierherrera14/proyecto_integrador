import type { ExamenFisico } from "../types";

const API_URL = "http://127.0.0.1:8000/examen_fisico";

export const getExamenesFisicos = async (): Promise<ExamenFisico[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createExamenFisico = async (
  examen: Omit<ExamenFisico, "id">
): Promise<ExamenFisico> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(examen),
  });
  if (!res.ok) throw new Error("Error creando examen físico");
  return res.json();
};

export const deleteExamenFisico = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error eliminando examen físico");
};

export const updateExamenFisico = async (
  id: number,
  data: Partial<ExamenFisico>
): Promise<ExamenFisico> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error actualizando examen físico");
  return res.json();
};

export const getExamenFisicoById = async (
  id: number
): Promise<ExamenFisico> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error obteniendo examen físico");
  return res.json();
};
