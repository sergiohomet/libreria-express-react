interface ConfirmDialogProps {
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmDialog({ mensaje, onConfirmar, onCancelar }: ConfirmDialogProps) {
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <p className="confirm-mensaje">{mensaje}</p>
        <div className="confirm-acciones">
          <button className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirmar}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
