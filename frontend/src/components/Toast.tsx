interface ToastProps {
  mensaje: string;
  tipo: 'exito' | 'error';
  onCerrar: () => void;
}

export default function Toast({ mensaje, tipo, onCerrar }: ToastProps) {
  return (
    <div className={`toast toast-${tipo}`} role="alert">
      <span>{mensaje}</span>
      <button className="toast-cerrar" onClick={onCerrar} aria-label="Cerrar">✕</button>
    </div>
  );
}
