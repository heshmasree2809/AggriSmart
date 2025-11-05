import apiService from './api.service';
import { API_ENDPOINTS } from './api.config';

class SoilService {
  // Get user's soil data
  async getSoilData() {
    return await apiService.get(API_ENDPOINTS.SOIL.GET);
  }

  // Update soil data
  async updateSoilData(soilData) {
    return await apiService.post(API_ENDPOINTS.SOIL.UPDATE, soilData);
  }

  // Get soil health analysis
  async getSoilHealthAnalysis() {
    return await apiService.get(API_ENDPOINTS.SOIL.ANALYSIS);
  }

  // Get soil history
  async getSoilHistory() {
    return await apiService.get(API_ENDPOINTS.SOIL.HISTORY);
  }

  // Compare soil data with optimal values
  async compareSoilData() {
    return await apiService.get(API_ENDPOINTS.SOIL.COMPARE);
  }
}

export default new SoilService();
