import type { Usuario } from "../types";

const API_URL = "http://127.0.0.1:8000/usuarios";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getUsuario = async (id: number): Promise<Usuario> => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const createUsuario = async (usuario: Omit<Usuario, "id" | "fecha_registro">) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return res.json();
};

export const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return res.json();
};

export const deleteUsuario = async (id: number) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
