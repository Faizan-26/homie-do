import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';
import { Button } from '../../../components/ui/button';
import { FaGoogle } from 'react-icons/fa';

const LoginForm = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Handle login logic here
      navigate('/dashboard');
    } else {
      setErrors(newErrors);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Google login clicked');
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  return (
    <div className="transition-all duration-300 ease-out transform animate-form">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-left">Login to your account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email address"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <FormInput
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#FF6347] focus:ring-[#FF6347] border-gray-300 dark:border-gray-600 rounded dark:bg-[#252b3b]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          
          <button
            type="button"
            onClick={handleForgotPasswordClick}
            className="text-sm text-[#FF6347] hover:text-[#FF5339] dark:text-[#FF7B61] dark:hover:text-[#FF8B71] transition-colors"
          >
            Forgot password?
          </button>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-[#FF6347] hover:bg-[#FF5339] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Login
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-[#1e2538] text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#252b3b] border border-gray-300 dark:border-gray-700/30 
            text-gray-700 dark:text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a3041] 
            transition-colors duration-200"
        >
          <FaGoogle className="text-[#4285F4]" />
          Continue with Google
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 