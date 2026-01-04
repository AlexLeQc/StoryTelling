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
  const API_URL = process.env.REACT_APP_API_URL || 'https://storytelling-mi4r.onrender.com';
  console.log('IMAGE DEBUG - API_URL:', API_URL);
  console.log('IMAGE DEBUG - imageId:', imageId);
  const finalUrl = imageId.startsWith('http') ? imageId :
    imageId.startsWith('/api/images/') ? `${API_URL}${imageId}` :
    `${API_URL}/api/images/${imageId}`;
  console.log('IMAGE DEBUG - finalUrl:', finalUrl);

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

