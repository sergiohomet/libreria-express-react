import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';

const USUARIO_VALIDO = 'admin';
const CONTRASENA_VALIDA = 'biblioteca123';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [errorCredenciales, setErrorCredenciales] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorCredenciales('');
    if (data.usuario === USUARIO_VALIDO && data.contrasena === CONTRASENA_VALIDA) {
      onLogin();
    } else {
      setErrorCredenciales('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>📚 Biblioteca</h1>
        <p className="subtitulo">Ingresá tus credenciales para continuar</p>

        {errorCredenciales && (
          <div className="error-general">{errorCredenciales}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              className={errors.usuario ? 'error' : ''}
              {...register('usuario')}
              placeholder="admin"
              autoComplete="username"
            />
            {errors.usuario && <span className="error-campo">{errors.usuario.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              className={errors.contrasena ? 'error' : ''}
              {...register('contrasena')}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.contrasena && <span className="error-campo">{errors.contrasena.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
