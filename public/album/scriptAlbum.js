document.getElementById('photoForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    const description = document.getElementById('description').value;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Enviar la imagen al backend
    const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();

    // Mostrar la imagen y la descripción en la galería
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');

    const img = document.createElement('img');
    img.src = result.url;
    img.alt = description;

    const caption = document.createElement('p');
    caption.textContent = description;

    galleryItem.appendChild(img);
    galleryItem.appendChild(caption);

    if (youtubeUrl) {
        const iframe = document.createElement('iframe');
        iframe.src = youtubeUrl.replace('watch?v=', 'embed/');
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        galleryItem.appendChild(iframe);
    }

    document.getElementById('gallery').appendChild(galleryItem);

    // Limpiar el formulario
    fileInput.value = '';
    document.getElementById('youtubeUrl').value = '';
    document.getElementById('description').value = '';
});
