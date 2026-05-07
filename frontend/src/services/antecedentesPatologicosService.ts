import type { AntecedentePatologico } from "../types";

const API_URL = "http://127.0.0.1:8000/antecedentes_patologicos";

export const getAntecedentes = async (): Promise<AntecedentePatologico[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createAntecedente = async (
  antecedente: Omit<AntecedentePatologico, "id">
) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(antecedente),
  });
  return res.json();
};

export const updateAntecedente = async (
  id: number,
  antecedente: AntecedentePatologico
) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(antecedente),
  });
  return res.json();
};
