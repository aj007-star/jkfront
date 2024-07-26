// src/components/NotFoundPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Importing the home icon from react-icons

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4 sm:text-7xl md:text-8xl">404</h1>
      <p className="text-2xl text-gray-600 mb-8 sm:text-3xl md:text-4xl">Page Not Found</p>
      <Link
        to={'/'}
        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-xl md:text-2xl"
      >
        <FaHome className="mr-2" />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
