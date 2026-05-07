import { useEffect, useState } from "react";
import type { Usuario } from "../../types";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../services/usuarioService";
import UsuarioForm from "./UsuarioForm";
import UsuarioList from "./UsuarioList";

export default function UsuarioCRUD() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editing, setEditing] = useState<Usuario | null>(null);

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (data: Partial<Usuario>) => {
    if (editing) {
      await updateUsuario(editing.id, data);
      setEditing(null);
    } else {
      await createUsuario(data as any);
    }
    fetchUsuarios();
  };

  const handleDelete = async (id: number) => {
    await deleteUsuario(id);
    fetchUsuarios();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Gestión de Usuarios</h2>
      <UsuarioForm onSubmit={handleSubmit} initialData={editing} />
      <UsuarioList usuarios={usuarios} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
