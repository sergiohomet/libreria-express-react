const anioActual = new Date().getFullYear();
const caracteresInvalidos = /[<>{}[\]\\]/;

function validateLibro(req, res, next) {
  const { titulo, autor, anio, disponible } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  if (caracteresInvalidos.test(titulo)) {
    return res.status(400).json({ error: 'El título contiene caracteres no permitidos' });
  }
  if (!autor || typeof autor !== 'string' || autor.trim() === '') {
    return res.status(400).json({ error: 'El autor es obligatorio' });
  }
  if (caracteresInvalidos.test(autor)) {
    return res.status(400).json({ error: 'El autor contiene caracteres no permitidos' });
  }
  if (typeof anio !== 'number' || !Number.isInteger(anio) || anio < 1900 || anio > anioActual) {
    return res.status(400).json({ error: `El año debe ser un número entero entre 1900 y ${anioActual}` });
  }
  if (typeof disponible !== 'boolean') {
    return res.status(400).json({ error: 'El campo disponible debe ser verdadero o falso' });
  }

  next();
}

module.exports = validateLibro;
