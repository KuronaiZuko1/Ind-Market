import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <p className="text-xl mb-4">Page Not Found</p>
        <Link to="/" className="text-primary-600 underline">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;