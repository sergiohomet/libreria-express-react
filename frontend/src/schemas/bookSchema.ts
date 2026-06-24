import { z } from 'zod';

const anioActual = new Date().getFullYear();

const caracteresInvalidos = /[<>{}[\]\\]/;

export const bookSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es obligatorio')
    .refine(v => !caracteresInvalidos.test(v), 'El título contiene caracteres no permitidos'),
  autor: z
    .string()
    .min(1, 'El autor es obligatorio')
    .refine(v => !caracteresInvalidos.test(v), 'El autor contiene caracteres no permitidos'),
  anio: z
    .number({ invalid_type_error: 'El año debe ser un número' })
    .int('El año debe ser un número entero')
    .min(1900, 'El año debe ser mayor o igual a 1900')
    .max(anioActual, `El año no puede ser mayor a ${anioActual}`),
  disponible: z.boolean(),
});

export type BookFormData = z.infer<typeof bookSchema>;
