const express = require('express');
const Libro = require('../models/Libro');
const validateLibro = require('../middleware/validateLibro');

const router = express.Router();

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const libros = await Libro.findAll();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los libros' });
  }
});

// Obtener un libro por ID
router.get('/:id', async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el libro' });
  }
});

// Crear un libro
router.post('/', validateLibro, async (req, res) => {
  try {
    const { titulo, autor, anio, disponible } = req.body;
    const libro = await Libro.create({ titulo: titulo.trim(), autor: autor.trim(), anio, disponible });
    res.status(201).json(libro);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el libro' });
  }
});

// Actualizar un libro
router.put('/:id', validateLibro, async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

    const { titulo, autor, anio, disponible } = req.body;
    await libro.update({ titulo: titulo.trim(), autor: autor.trim(), anio, disponible });
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
});

// Eliminar un libro
router.delete('/:id', async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

    await libro.destroy();
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el libro' });
  }
});

module.exports = router;
