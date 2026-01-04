import api from './api';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post('/api/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getImageUrl = (imageId) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  if (imageId.startsWith('http')) {
    return imageId;
  }
  if (imageId.startsWith('/api/images/')) {
    return `${API_URL}${imageId}`;
  }
  return `${API_URL}/api/images/${imageId}`;
};

export const deleteImage = async (imageId) => {
  const response = await api.delete(`/api/images/${imageId}`);
  return response.data;
};

