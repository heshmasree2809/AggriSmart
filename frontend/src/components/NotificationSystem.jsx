import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Slide, Stack } from '@mui/material';

// Notification context
export const NotificationContext = React.createContext();

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      duration
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (message) => showNotification(message, 'success');
  const showError = (message) => showNotification(message, 'error');
  const showWarning = (message) => showNotification(message, 'warning');
  const showInfo = (message) => showNotification(message, 'info');

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      <NotificationDisplay 
        notifications={notifications}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

// Notification Display Component
const NotificationDisplay = ({ notifications, onClose }) => {
  return (
    <Stack spacing={1} sx={{ position: 'fixed', top: 80, right: 20, zIndex: 9999 }}>
      {notifications.map((notification) => (
        <Slide 
          key={notification.id} 
          direction="left" 
          in={true} 
          mountOnEnter 
          unmountOnExit
        >
          <Alert
            severity={notification.type}
            onClose={() => onClose(notification.id)}
            sx={{
              minWidth: 300,
              boxShadow: 3,
              '& .MuiAlert-icon': {
                fontSize: 28
              }
            }}
            className="animate-slide-in"
          >
            {notification.message}
          </Alert>
        </Slide>
      ))}
    </Stack>
  );
};

export default NotificationProvider;
