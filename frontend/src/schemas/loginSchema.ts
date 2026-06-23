import { z } from 'zod';

export const loginSchema = z.object({
  usuario: z.string().min(1, 'El usuario es obligatorio'),
  contrasena: z.string().min(1, 'La contraseña es obligatoria'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
