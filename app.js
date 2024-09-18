// Importar dependencias necesarias
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path');

// Inicializar la aplicación de Express
const app = express();

// Permitir que cualquier dominio acceda a la API (CORS)
app.use(cors());

// Configuración para recibir datos en formato JSON
app.use(express.json());

// Configurar la carpeta 'public' para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dbikzyivp',  // Reemplaza con tu cloud_name
  api_key: '938154962967196',  // Reemplaza con tu API key
  api_secret: 'nSa01FPaxQBzrwDn7_Bn_fq-YNE'  // Reemplaza con tu API secret
});

// Configuración de almacenamiento de Cloudinary con Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'album',  // Nombre de la carpeta en Cloudinary donde se guardarán las imágenes
    format: async (req, file) => 'png',  // Puedes cambiar el formato si lo necesitas
    public_id: (req, file) => file.originalname  // Nombre del archivo en Cloudinary
  },
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen a Cloudinary
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ url: req.file.path });  // Retorna la URL de la imagen almacenada en Cloudinary
});

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de fallback en caso de que no se encuentre la página
app.get('*', (req, res) => {
  res.status(404).send('Página no encontrada');
});

// Configuración del puerto (Render asigna un puerto automáticamente, si no, usar 3000)
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
