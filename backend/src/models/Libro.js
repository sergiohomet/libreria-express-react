const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Libro = db.define('Libro', {
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  autor: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'libros',
  timestamps: false,
});

module.exports = Libro;
