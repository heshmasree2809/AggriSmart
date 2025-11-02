import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class AuthService {
  // Login
  async login(email, password) {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });

    if (response.success) {
      const { token, refreshToken, user } = response.data;
      
      // Store auth data
      localStorage.setItem('agrismart_token', token);
      localStorage.setItem('agrismart_refresh_token', refreshToken);
      localStorage.setItem('agrismart_user', JSON.stringify(user));
      
      return { success: true, user };
    }

    return response;
  }

  // Signup
  async signup(userData) {
    const response = await apiService.post(API_ENDPOINTS.AUTH.SIGNUP, userData);

    if (response.success) {
      const { token, refreshToken, user } = response.data;
      
      // Store auth data
      localStorage.setItem('agrismart_token', token);
      localStorage.setItem('agrismart_refresh_token', refreshToken);
      localStorage.setItem('agrismart_user', JSON.stringify(user));
      
      return { success: true, user };
    }

    return response;
  }

  // Logout
  async logout() {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('agrismart_token');
      localStorage.removeItem('agrismart_refresh_token');
      localStorage.removeItem('agrismart_user');
      
      // Redirect to login
      window.location.href = '/login';
    }
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('agrismart_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('agrismart_token');
  }

  // Update profile
  async updateProfile(profileData) {
    const response = await apiService.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);

    if (response.success) {
      const { user } = response.data;
      localStorage.setItem('agrismart_user', JSON.stringify(user));
      return { success: true, user };
    }

    return response;
  }

  // Forgot password
  async forgotPassword(email) {
    return await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  // Reset password
  async resetPassword(token, newPassword) {
    return await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword
    });
  }

  // Verify email
  async verifyEmail(token) {
    return await apiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }
}

export default new AuthService();
