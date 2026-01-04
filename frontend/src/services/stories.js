import api from './api';

export const getStories = async () => {
  const response = await api.get('/api/stories');
  return response.data;
};

export const getStory = async (id) => {
  const response = await api.get(`/api/stories/${id}`);
  return response.data;
};

export const getPublicStory = async (shareId) => {
  const response = await api.get(`/api/stories/public/${shareId}`);
  return response.data;
};

export const createStory = async (storyData) => {
  const response = await api.post('/api/stories', storyData);
  return response.data;
};

export const updateStory = async (id, storyData) => {
  const response = await api.put(`/api/stories/${id}`, storyData);
  return response.data;
};

export const deleteStory = async (id) => {
  const response = await api.delete(`/api/stories/${id}`);
  return response.data;
};

export const duplicateStory = async (id) => {
  const response = await api.post(`/api/stories/${id}/duplicate`);
  return response.data;
};

