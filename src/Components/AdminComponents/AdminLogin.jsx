// src/AdminLogin.js
import React, { useState } from 'react';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';
import api from '../../Utils/api';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const adminLogin = async () => {
    try {
      let data={username,password}
            const  response  = await api.post('/admin/login',data);
            if(response.data.success)
            {
                 localStorage.setItem('token',response.data.token);
                 navigate('/admin/productlist');
            }
    } catch (error) {
        console.error('Failed to Login Admin', error);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    adminLogin()
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPassword('');
      setUsername('');
      setErrors({});
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
              Username
            </label>
            <div className="flex items-center border rounded-md mt-1">
              <FaUser className="ml-2 text-gray-500" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 ml-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your username"
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border rounded-md mt-1">
              <FaLock className="ml-2 text-gray-500" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 ml-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-semibold rounded-md transition-colors ${
              loading
                ? 'bg-gradient-to-r from-blue-300 via-yellow-200 to-blue-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-yellow-400 hover:from-yellow-400 hover:to-blue-800'
            } flex items-center justify-center`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Please wait...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
