require('dotenv').config();

const express = require('express');
const cors = require('cors');
const librosRouter = require('./routes/libros');
const apiKeyAuth = require('./middleware/apiKeyAuth');

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use('/libros', apiKeyAuth, librosRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
