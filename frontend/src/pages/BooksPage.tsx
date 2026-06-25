import { useState, useMemo } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookTable from '../components/BookTable';
import BookModal from '../components/BookModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import type { Book } from '../types/Book';
import type { BookFormData } from '../schemas/bookSchema';

interface BooksPageProps {
  onLogout: () => void;
}

interface ToastState {
  mensaje: string;
  tipo: 'exito' | 'error';
}

export default function BooksPage({ onLogout }: BooksPageProps) {
  const { books, loading, addBook, editBook, removeBook } = useBooks();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState<Book | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<'todos' | 'disponibles' | 'no-disponibles'>('todos');

  const mostrarToast = (mensaje: string, tipo: 'exito' | 'error') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const abrirModalNuevo = () => {
    setLibroSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (libro: Book) => {
    setLibroSeleccionado(libro);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setLibroSeleccionado(null);
  };

  const handleGuardar = async (data: BookFormData) => {
    try {
      if (libroSeleccionado) {
        await editBook(libroSeleccionado.id, data);
        mostrarToast('Libro actualizado correctamente', 'exito');
      } else {
        await addBook(data);
        mostrarToast('Libro agregado correctamente', 'exito');
      }
      cerrarModal();
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al guardar el libro';
      mostrarToast(mensaje, 'error');
    }
  };

  const handleEliminar = (id: number) => {
    setConfirmId(id);
  };

  const confirmarEliminar = async () => {
    if (confirmId === null) return;
    setConfirmId(null);
    try {
      await removeBook(confirmId);
      mostrarToast('Libro eliminado correctamente', 'exito');
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar el libro';
      mostrarToast(mensaje, 'error');
    }
  };

  const librosFiltrados = useMemo(() => {
    return books
      .filter(libro => {
        const coincideBusqueda = libro.titulo.toLowerCase().includes(busqueda.toLowerCase());
        const coincideDisponibilidad =
          filtroDisponibilidad === 'todos' ||
          (filtroDisponibilidad === 'disponibles' && libro.disponible) ||
          (filtroDisponibilidad === 'no-disponibles' && !libro.disponible);
        return coincideBusqueda && coincideDisponibilidad;
      });
  }, [books, busqueda, filtroDisponibilidad]);

  return (
    <div className="books-page">
      <div className="header">
        <h1>Gestión de Biblioteca</h1>
        <button className="btn btn-secondary" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="controls">
        <input
          type="text"
          className="buscador"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select
          className="filtro-select"
          value={filtroDisponibilidad}
          onChange={e => setFiltroDisponibilidad(e.target.value as typeof filtroDisponibilidad)}
        >
          <option value="todos">Todos</option>
          <option value="disponibles">Disponibles</option>
          <option value="no-disponibles">No disponibles</option>
        </select>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>
          + Agregar libro
        </button>
      </div>

      {loading ? (
        <p className="estado-carga">Cargando libros...</p>
      ) : (
        <BookTable
          libros={librosFiltrados}
          onEditar={abrirModalEditar}
          onEliminar={handleEliminar}
        />
      )}

      {modalAbierto && (
        <BookModal
          libro={libroSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={handleGuardar}
        />
      )}

      {confirmId !== null && (
        <ConfirmDialog
          mensaje="¿Estás seguro de que querés eliminar este libro?"
          onConfirmar={confirmarEliminar}
          onCancelar={() => setConfirmId(null)}
        />
      )}

      {toast && (
        <Toast
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onCerrar={() => setToast(null)}
        />
      )}
    </div>
  );
}
