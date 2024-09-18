const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');

const app = express();
app.use(cors());  // Permite que cualquier dominio acceda a la API
app.use(express.json()); // Para procesar JSON en las solicitudes

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dbikzyivp',
  api_key: '938154962967196',
  api_secret: 'nSa01FPaxQBzrwDn7_Bn_fq-YNE'
});

// Configuración de almacenamiento de Cloudinary con Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'album',  // Nombre de la carpeta donde se guardarán las imágenes
    format: async (req, file) => 'png',  // Formato de la imagen
    public_id: (req, file) => file.originalname
  },
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ url: req.file.path });  // Retorna la URL de la imagen almacenada
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
const express = require('express');
const path = require('path');

const app = express();

// Configurar la carpeta 'public' como carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Puerto en el que corre el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

