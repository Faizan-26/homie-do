import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';
import { Button } from '../../../components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import config from '../../../config';
import { getEmailValidationError } from '../../../utils/validators';

const SignupForm = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');

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
    if (signupError) {
      setSignupError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    const emailError = getEmailValidationError(formData.email);
    if (emailError) {
      newErrors.email = emailError;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSignupError('');
      
      try {
        // Call your API to register
        const response = await fetch(`${config.api.baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Use register from AuthContext
          register(data.user, data.token);
          navigate('/dashboard');
        } else {
          setSignupError(data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setSignupError('An error occurred during registration. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleGoogleSignup = async () => {
    // Google login would typically redirect to Google OAuth
    // For this implementation, we'll create a placeholder
    window.location.href = `${config.api.baseUrl}/api/auth/google`;
  };

  return (
    <div className="transition-all duration-300 ease-out transform animate-form">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-left">
        Create an account
      </h2>
      
      {signupError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {signupError}
        </div>
      )}
      
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
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