import api from './api';

export const eaService = {
  async getAllEAs() {
    const response = await api.get('/eas');
    return response.data;
  },
};
