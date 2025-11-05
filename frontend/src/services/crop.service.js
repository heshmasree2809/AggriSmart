import apiService from './api.service';
import { API_ENDPOINTS } from './api.config';

class CropService {
  // Get crop recommendations
  async getRecommendations(season, region, soilType) {
    const params = {};
    if (season) params.season = season;
    if (region) params.region = region;
    if (soilType) params.soilType = soilType;
    
    return await apiService.get(API_ENDPOINTS.CROP.RECOMMENDATIONS, params);
  }

  // Get crop details
  async getCropDetails(cropName) {
    return await apiService.get(API_ENDPOINTS.CROP.DETAILS(cropName));
  }

  // Get seasonal calendar
  async getSeasonalCalendar() {
    return await apiService.get(API_ENDPOINTS.CROP.CALENDAR);
  }

  // Save crop recommendation (Admin only)
  async saveRecommendation(recommendationData) {
    return await apiService.post(API_ENDPOINTS.CROP.SAVE, recommendationData);
  }
}

export default new CropService();
