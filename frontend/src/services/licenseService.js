import api from './api';

export const licenseService = {
  async getUserLicenses() {
    const response = await api.get('/licenses/my-licenses');
    return response.data;
  },

  async purchaseLicense(purchaseData) {
    const response = await api.post('/licenses/purchase', purchaseData);
    return response.data;
  },
};
