import type { Book } from '../types/Book';

interface BookTableProps {
  libros: Book[];
  onEditar: (libro: Book) => void;
  onEliminar: (id: number) => void;
}

export default function BookTable({ libros, onEditar, onEliminar }: BookTableProps) {
  if (libros.length === 0) {
    return <p className="sin-libros">No hay libros registrados.</p>;
  }

  return (
    <div className="tabla-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Año</th>
            <th>Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.map(libro => (
            <tr key={libro.id}>
              <td>{libro.id}</td>
              <td>{libro.titulo}</td>
              <td>{libro.autor}</td>
              <td>{libro.anio}</td>
              <td>
                <span className={libro.disponible ? 'badge badge-disponible' : 'badge badge-no-disponible'}>
                  {libro.disponible ? 'Disponible' : 'No disponible'}
                </span>
              </td>
              <td>
                <div className="acciones">
                  <button
                    className="btn btn-primary btn-tabla"
                    onClick={() => onEditar(libro)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-tabla"
                    onClick={() => onEliminar(libro.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
