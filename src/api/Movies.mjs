import axios from 'axios';

// Agregar un endpoint para obtener detalles de una película desde OMDb API
router.get('/details/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Reemplaza 'YOUR_API_KEY' por tu clave de la API OMDb
        const apiUrl = `http://www.omdbapi.com/?i=${id}&apikey=a2a87c13`;
        const response = await axios.get(apiUrl);
        const movieDetails = response.data;

        // Si la película existe, responder con los detalles
        if (movieDetails.Response === 'True') {
            res.json(movieDetails);
        } else {
            res.status(404).json({ error: 'Película no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener detalles de la película:', error);
        res.status(500).json({ error: 'Error en la petición a OMDb' });
    }
});
