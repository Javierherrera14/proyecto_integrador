import type { Usuario } from "../../types";

interface Props {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

export default function UsuarioList({ usuarios, onEdit, onDelete }: Props) {
  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id}>
            <td>{u.nombre_completo}</td>
            <td>{u.email}</td>
            <td>{u.rol}</td>
            <td>
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(u)}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(u.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
