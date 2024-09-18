document.getElementById('photoForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    const description = document.getElementById('description').value;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);  // Añadir la imagen
    formData.append('description', description);  // Añadir la descripción
    formData.append('youtubeUrl', youtubeUrl);    // Añadir la URL de YouTube

    // Enviar la imagen al backend para almacenarla
    try {
        const response = await fetch('https://albumalosamu.onrender.com/upload', { 
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Si se subió correctamente, agrega la imagen a la galería
            addImageToGallery(result.image.image_url, result.image.description, youtubeUrl);
        } else {
            console.error('Error al subir la imagen:', result.error);
        }

    } catch (error) {
        console.error('Error al subir la imagen:', error);
    }

    // Limpiar el formulario después de la subida
    fileInput.value = '';
    document.getElementById('youtubeUrl').value = '';
    document.getElementById('description').value = '';
});

// Función para cargar todas las imágenes al cargar la página
window.addEventListener('load', async function () {
    try {
        const response = await fetch('https://albumalosamu.onrender.com/images');
        const images = await response.json();

        if (Array.isArray(images)) {
            images.forEach(image => {
                addImageToGallery(image.image_url, image.description, image.youtube_url);
            });
        } else {
            console.error('No se recibió un array de imágenes:', images);
        }

    } catch (error) {
        console.error('Error al obtener imágenes:', error);
    }
});

// Función auxiliar para agregar una imagen a la galería
function addImageToGallery(imageUrl, description, youtubeUrl) {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = description;

    const caption = document.createElement('p');
    caption.textContent = description;

    galleryItem.appendChild(img);
    galleryItem.appendChild(caption);

    // Si hay una URL de YouTube, añadir el iframe para mostrar el video
    if (youtubeUrl) {
        const iframe = document.createElement('iframe');
        iframe.src = youtubeUrl.replace('watch?v=', 'embed/');
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        galleryItem.appendChild(iframe);
    }

    // Añadir el elemento a la galería
    document.getElementById('gallery').appendChild(galleryItem);
}
