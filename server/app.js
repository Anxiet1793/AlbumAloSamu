// Importar dependencias necesarias
const express = require('express');
const path = require('path');

// Inicializar la aplicación de Express
const app = express();

// Configurar la carpeta 'public' para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo index.html cuando se accede a la raíz ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de fallback en caso de que no se encuentre la página
app.get('*', (req, res) => {
  res.status(404).send('Página no encontrada');
});

// Configuración del puerto (Render asigna un puerto automáticamente, si no usa 3000)
const PORT = process.env.PORT || 3000;

// Iniciar el servidor y escuchar en el puerto configurado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

