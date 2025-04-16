import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';
import { Button } from '../../../components/ui/button';
import { FaGoogle } from 'react-icons/fa';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Handle signup logic here
      navigate('/dashboard');
    } else {
      setErrors(newErrors);
    }
  };

  const handleGoogleSignup = () => {
    // Handle Google signup logic here
    console.log('Google signup clicked');
  };

  return (
    <div className="transition-all duration-300 ease-out transform animate-form">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-left">
        Create an account
      </h2>
      
      <div className="form-container">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Full Name"
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />
          
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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          
          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-[#FF6347] focus:ring-[#FF6347] border-gray-300 dark:border-gray-600 rounded dark:bg-[#252b3b]"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <span className="text-[#FF6347] dark:text-[#FF7B61] hover:text-[#FF5339] dark:hover:text-[#FF8B71] cursor-pointer transition-colors">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-[#FF6347] dark:text-[#FF7B61] hover:text-[#FF5339] dark:hover:text-[#FF8B71] cursor-pointer transition-colors">
                Privacy Policy
              </span>
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#FF6347] hover:bg-[#FF5339] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Up
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#1e2538] text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#252b3b] border border-gray-300 dark:border-gray-700/30 
              text-gray-700 dark:text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a3041] 
              transition-colors duration-200"
          >
            <FaGoogle className="text-[#4285F4]" />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm; 