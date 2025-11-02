import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('agrismart_token');
        const savedUser = localStorage.getItem('agrismart_user');
        
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    
    try {
      // Make API call to backend
      const response = await api.post('/login', credentials);
      
      // Response from server: { success: true, token, user, message }
      if (response && response.success) {
        const token = response.token;
        const user = response.user;
        
        if (token && user) {
          // Save to localStorage
          localStorage.setItem('agrismart_token', token);
          localStorage.setItem('agrismart_user', JSON.stringify(user));
          
          setUser(user);
          navigate('/');
          return { success: true, user };
        } else {
          throw new Error('Invalid response: Missing token or user');
        }
      } else {
        // Handle error response from ApiService
        const errorMsg = response?.error || response?.message || 'Login failed';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please check your connection and credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setError(null);
    setLoading(true);
    
    try {
      // Make API call to backend
      const response = await api.post('/signup', userData);
      
      // Response from server: { success: true, token, user, message }
      if (response && response.success) {
        const token = response.token;
        const user = response.user;
        
        if (token && user) {
          // Save to localStorage
          localStorage.setItem('agrismart_token', token);
          localStorage.setItem('agrismart_user', JSON.stringify(user));
          
          setUser(user);
          navigate('/');
          return { success: true, user };
        } else {
          throw new Error('Invalid response: Missing token or user');
        }
      } else {
        // Handle error response from ApiService
        const errorMsg = response?.error || response?.message || 'Signup failed';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.message || 'Signup failed. Please check your connection and try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('agrismart_token');
    localStorage.removeItem('agrismart_user');
    setUser(null);
    navigate('/login');
  };

  const updateProfile = async (profileData) => {
    setError(null);
    setLoading(true);
    
    try {
      if (!user) {
        throw new Error('User not logged in');
      }
      
      // Make API call to update profile
      const response = await api.put('/auth/update-profile', profileData);
      
      if (response.success && response.data) {
        const updatedUser = response.data.user || response.data;
        localStorage.setItem('agrismart_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.error || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('agrismart_token');
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
