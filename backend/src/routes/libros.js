const express = require('express');
const fs = require('fs');
const path = require('path');
const validateLibro = require('../middleware/validateLibro');

const router = express.Router();
const dataPath = path.join(__dirname, '../../data/libros.json');

function leerLibros() {
  const contenido = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(contenido);
}

function guardarLibros(libros) {
  fs.writeFileSync(dataPath, JSON.stringify(libros, null, 2), 'utf-8');
}

// Obtener todos los libros
router.get('/', (req, res) => {
  const libros = leerLibros();
  res.json(libros);
});

// Obtener un libro por ID
router.get('/:id', (req, res) => {
  const libros = leerLibros();
  const libro = libros.find(l => l.id === Number(req.params.id));
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(libro);
});

// Crear un libro
router.post('/', validateLibro, (req, res) => {
  const libros = leerLibros();
  const { titulo, autor, anio, disponible } = req.body;

  const nuevoId = libros.length > 0 ? Math.max(...libros.map(l => l.id)) + 1 : 1;

  const nuevoLibro = { id: nuevoId, titulo: titulo.trim(), autor: autor.trim(), anio, disponible };
  libros.push(nuevoLibro);
  guardarLibros(libros);

  res.status(201).json(nuevoLibro);
});

// Actualizar un libro
router.put('/:id', validateLibro, (req, res) => {
  const libros = leerLibros();
  const index = libros.findIndex(l => l.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Libro no encontrado' });

  const { titulo, autor, anio, disponible } = req.body;
  libros[index] = { id: libros[index].id, titulo: titulo.trim(), autor: autor.trim(), anio, disponible };
  guardarLibros(libros);

  res.json(libros[index]);
});

// Eliminar un libro
router.delete('/:id', (req, res) => {
  const libros = leerLibros();
  const index = libros.findIndex(l => l.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Libro no encontrado' });

  const [eliminado] = libros.splice(index, 1);
  guardarLibros(libros);

  res.json(eliminado);
});

module.exports = router;
