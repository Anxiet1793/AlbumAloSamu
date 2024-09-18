const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg'); // Importar el cliente de PostgreSQL
require('dotenv').config(); // Para cargar las variables de entorno del archivo .env

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dbikzyivp',
  api_key: '938154962967196',
  api_secret: 'nSa01FPaxQBzrwDn7_Bn_fq-YNE'
});

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Para evitar problemas de SSL en Render
  }
});

// Configuración de almacenamiento de Cloudinary con Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'album',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname
  },
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen y guardar su información en PostgreSQL
app.post('/upload', upload.single('file'), async (req, res) => {
  const { description, youtubeUrl } = req.body;
  const imageUrl = req.file.path;

  try {
    // Guardar la URL de la imagen y descripción en PostgreSQL
    const result = await pool.query(
      'INSERT INTO images (image_url, description, youtube_url) VALUES ($1, $2, $3) RETURNING *',
      [imageUrl, description, youtubeUrl]
    );
    res.json({ success: true, image: result.rows[0] });
  } catch (error) {
    console.error('Error al guardar en la base de datos:', error);
    res.status(500).json({ success: false, error: 'Error al guardar en la base de datos' });
  }
});

// Ruta para obtener todas las imágenes desde PostgreSQL
app.get('/images', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM images ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener imágenes de la base de datos:', error);
    res.status(500).json({ success: false, error: 'Error al obtener imágenes' });
  }
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Puerto en el que corre el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

