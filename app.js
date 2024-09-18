const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg'); // Cliente PostgreSQL

const app = express();
app.use(cors());  // Permitir solicitudes desde cualquier origen
app.use(express.json());  // Parsear JSON en solicitudes
app.use(express.static(path.join(__dirname, 'public')));  // Servir archivos estáticos

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbikzyivp',
  api_key: process.env.CLOUDINARY_API_KEY || '938154962967196',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'nSa01FPaxQBzrwDn7_Bn_fq-YNE'
});

// Conexión a la base de datos PostgreSQL con la URL proporcionada directamente
const pool = new Pool({
  connectionString: 'postgres://albumalosamu_user:v6IRsZNmR1gI0q7TG4UieRasU5747xMH@dpg-crlk078gph6c73e76a60-a:5432/albumalosamu',
  ssl: {
    rejectUnauthorized: false  // Para evitar problemas de SSL
  }
});

// Configuración de almacenamiento de Cloudinary con Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'album',
    format: async (req, file) => 'png',  // Formato de la imagen
    public_id: (req, file) => file.originalname  // Nombre de la imagen
  }
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen y guardar en PostgreSQL
app.post('/upload', upload.single('file'), async (req, res) => {
  const { description, youtubeUrl } = req.body;
  const imageUrl = req.file.path;  // URL de la imagen subida a Cloudinary

  try {
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

// Ruta para crear la tabla de imágenes si no existe
app.get('/create-table', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        description TEXT,
        youtube_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    res.send('Tabla creada exitosamente');
  } catch (error) {
    console.error('Error creando la tabla:', error);
    res.status(500).send('Error al crear la tabla');
  }
});

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Puerto en el que corre el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
