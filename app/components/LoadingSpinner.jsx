import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Loader with darker overlay */}
      <div className="loader">Loading...</div>
    </div>
  );
};

export default LoadingSpinner;


