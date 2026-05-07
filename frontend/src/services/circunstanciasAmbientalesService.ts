// services/circunstanciasAmbientales.ts
import type { CircunstanciaAmbiental } from "../types";

const API_URL = "http://127.0.0.1:8000/circunstancias_ambientales";

// Obtener todas las circunstancias
export const getCircunstancias = async (): Promise<CircunstanciaAmbiental[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error obteniendo circunstancias ambientales");
  return res.json();
};

// Crear una nueva circunstancia ambiental
export const createCircunstanciaAmbiental = async (
  circunstancia: Omit<CircunstanciaAmbiental, "id">
): Promise<any> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(circunstancia),
  });
  if (!res.ok) throw new Error("Error creando circunstancia ambiental");
  return res.json();
};

// Eliminar una circunstancia ambiental por ID
export const deleteCircunstanciaAmbiental = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error eliminando circunstancia ambiental");
};

// Actualizar una circunstancia ambiental por ID
export const updateCircunstanciaAmbiental = async (
  id: number,
  data: Partial<Omit<CircunstanciaAmbiental, "id" | "id_paciente">> // asumimos que solo se actualizan campos booleanos
): Promise<any> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error actualizando circunstancia ambiental");
  return res.json();
};

