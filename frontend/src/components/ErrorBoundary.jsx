import React, { Component } from 'react';
import { Alert, Button, Container, Typography, Box } from '@mui/material';
import { Refresh, Home } from '@mui/icons-material';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box className="text-center animate-fade-in">
            <div className="text-6xl mb-4">🌱💔</div>
            <Typography variant="h4" className="font-bold text-gray-800 mb-4">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert severity="error" className="mb-6 text-left">
                <Typography variant="subtitle2" className="font-bold mb-2">
                  Error Details:
                </Typography>
                <pre className="text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </Alert>
            )}

            <Box className="flex gap-4 justify-center">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReset}
                className="btn-primary"
              >
                Refresh Page
              </Button>
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={() => window.location.href = '/'}
                className="btn-outline"
              >
                Go Home
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Error Message Component
export const ErrorMessage = ({ 
  error, 
  title = 'Error', 
  onRetry = null,
  showDetails = false 
}) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="text-3xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-800 mb-2">{title}</h3>
          <p className="text-red-600">
            {error?.message || error || 'An unexpected error occurred'}
          </p>
          
          {showDetails && error?.stack && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-red-700 hover:text-red-900">
                View Details
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}
          
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="contained"
              size="small"
              className="mt-4 bg-red-600 hover:bg-red-700"
              startIcon={<Refresh />}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Network Error Component
export const NetworkError = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="text-6xl mb-4">📡</div>
      <Typography variant="h5" className="font-bold text-gray-800 mb-2">
        No Internet Connection
      </Typography>
      <Typography variant="body2" className="text-gray-600 mb-6 text-center max-w-md">
        Please check your internet connection and try again.
      </Typography>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="contained"
          className="btn-primary"
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      )}
    </div>
  );
};

// Not Found Component
export const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box className="text-center animate-scale-in">
        <div className="text-8xl mb-4">🌾❓</div>
        <Typography variant="h3" className="font-bold text-gray-800 mb-4">
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          href="/"
          className="btn-primary"
          startIcon={<Home />}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorBoundary;
