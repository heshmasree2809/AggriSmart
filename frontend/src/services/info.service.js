import apiService from './api.service';
import { API_ENDPOINTS } from './api.config';

class InfoService {
  // Get fertilizers information
  async getFertilizers() {
    return await apiService.get(API_ENDPOINTS.INFO.FERTILIZERS);
  }

  // Get pests information
  async getPests() {
    return await apiService.get(API_ENDPOINTS.INFO.PESTS);
  }

  // Get government schemes
  async getSchemes() {
    return await apiService.get(API_ENDPOINTS.INFO.SCHEMES);
  }
}

export default new InfoService();
