import apiService from './api.service';
import { API_ENDPOINTS } from './api.config';

class DiseaseService {
  // Scan plant disease
  async scanDisease(imageFile, cropType) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('cropType', cropType);
    
    return await apiService.upload(API_ENDPOINTS.DISEASE.SCAN, formData);
  }

  // Get user's disease scans
  async getMyScans(params = {}) {
    return await apiService.get(API_ENDPOINTS.DISEASE.MY_SCANS, params);
  }

  // Get single scan details
  async getScanDetails(scanId) {
    return await apiService.get(API_ENDPOINTS.DISEASE.SCAN_DETAILS(scanId));
  }

  // Delete scan
  async deleteScan(scanId) {
    return await apiService.delete(API_ENDPOINTS.DISEASE.DELETE_SCAN(scanId));
  }

  // Get disease statistics
  async getDiseaseStats() {
    return await apiService.get(API_ENDPOINTS.DISEASE.STATS);
  }

  // Expert review (for experts only)
  async reviewScan(scanId, reviewData) {
    return await apiService.put(API_ENDPOINTS.DISEASE.REVIEW(scanId), reviewData);
  }
}

export default new DiseaseService();
