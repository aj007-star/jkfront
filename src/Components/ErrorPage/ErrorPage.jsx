// src/components/ErrorPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const ErrorPage = ({ errorCode, errorMessage }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4 sm:text-6xl md:text-7xl">
        {errorCode || 'Error'}
      </h1>
      <p className="text-xl text-gray-600 mb-8 sm:text-2xl md:text-3xl">
        {errorMessage || 'Something went wrong'}
      </p>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-xl md:text-2xl"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-md text-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellbg-yellow-500 sm:text-xl md:text-2xl"
        >
          <FaHome className="mr-2" />
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
