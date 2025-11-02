import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

// Full Page Loader
export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center animate-scale-in">
        <div className="relative">
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ color: '#16a34a' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🌱</span>
          </div>
        </div>
        <Typography variant="h6" className="mt-4 text-gray-700 font-medium">
          {message}
        </Typography>
        <div className="loading-dots mt-2">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Card Loader
export const SkeletonCard = () => {
  return (
    <div className="card-modern">
      <div className="skeleton h-16 w-16 mx-auto mb-4 rounded-full"></div>
      <div className="skeleton h-6 w-3/4 mx-auto mb-3"></div>
      <div className="skeleton h-4 w-full mb-2"></div>
      <div className="skeleton h-4 w-5/6 mx-auto mb-4"></div>
      <div className="skeleton h-10 w-full rounded-xl"></div>
    </div>
  );
};

// Product Skeleton
export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="skeleton h-48 w-full mb-4 rounded-lg"></div>
      <div className="skeleton h-6 w-3/4 mb-2"></div>
      <div className="skeleton h-4 w-1/2 mb-3"></div>
      <div className="flex justify-between items-center">
        <div className="skeleton h-8 w-20"></div>
        <div className="skeleton h-10 w-28 rounded-lg"></div>
      </div>
    </div>
  );
};

// Inline Loader
export const InlineLoader = ({ size = 20 }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <CircularProgress size={size} thickness={3} sx={{ color: '#16a34a' }} />
    </span>
  );
};

// Button Loader
export const ButtonLoader = ({ loading, children, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <CircularProgress size={16} thickness={3} sx={{ color: 'white' }} />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

// Page Section Loader
export const SectionLoader = ({ height = '300px' }) => {
  return (
    <div className={`flex items-center justify-center`} style={{ height }}>
      <div className="text-center">
        <div className="animate-bounce text-4xl mb-2">🌾</div>
        <Typography variant="body2" className="text-gray-500">
          Loading content...
        </Typography>
      </div>
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <div className="skeleton h-8 w-1/4"></div>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="p-4">
                <div className="skeleton h-4 w-full"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <div className="skeleton h-4 w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FullPageLoader;
