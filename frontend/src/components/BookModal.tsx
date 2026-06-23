import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookSchema, type BookFormData } from '../schemas/bookSchema';
import type { Book } from '../types/Book';

interface BookModalProps {
  libro?: Book | null;
  onCerrar: () => void;
  onGuardar: (data: BookFormData) => Promise<void>;
}

export default function BookModal({ libro, onCerrar, onGuardar }: BookModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      titulo: '',
      autor: '',
      anio: new Date().getFullYear(),
      disponible: true,
    },
  });

  useEffect(() => {
    if (libro) {
      reset({
        titulo: libro.titulo,
        autor: libro.autor,
        anio: libro.anio,
        disponible: libro.disponible,
      });
    } else {
      reset({ titulo: '', autor: '', anio: new Date().getFullYear(), disponible: true });
    }
  }, [libro, reset]);

  const onSubmit = async (data: BookFormData) => {
    await onGuardar(data);
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>{libro ? 'Editar libro' : 'Agregar libro'}</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              className={errors.titulo ? 'error' : ''}
              {...register('titulo')}
              placeholder="Ingresá el título"
            />
            {errors.titulo && <span className="error-campo">{errors.titulo.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="autor">Autor</label>
            <input
              id="autor"
              type="text"
              className={errors.autor ? 'error' : ''}
              {...register('autor')}
              placeholder="Ingresá el autor"
            />
            {errors.autor && <span className="error-campo">{errors.autor.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="anio">Año de publicación</label>
            <input
              id="anio"
              type="number"
              className={errors.anio ? 'error' : ''}
              {...register('anio', { valueAsNumber: true })}
            />
            {errors.anio && <span className="error-campo">{errors.anio.message}</span>}
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                id="disponible"
                type="checkbox"
                {...register('disponible')}
              />
              <label htmlFor="disponible">Disponible</label>
            </div>
          </div>

          <div className="modal-acciones">
            <button type="button" className="btn btn-secondary" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
