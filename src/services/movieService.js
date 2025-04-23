// src/services/movieService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getMovies = async (isChild = false) => {
  try {
    const response = await axios.get(`${API_URL}/api/movies`, {
      params: { isChild }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Para el admin
export const createMovie = async (movieData) => {
  try {
    const response = await axios.post(`${API_URL}/api/movies`, movieData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
};