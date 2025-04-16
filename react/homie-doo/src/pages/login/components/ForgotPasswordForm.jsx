import React, { useState } from 'react';
import FormInput from './FormInput';
import { Button } from '../../../components/ui/button';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    // Handle password reset logic here
    setIsSubmitted(true);
  };

  return (
    <div className="transition-all duration-300 ease-out transform animate-form">
      <div className="text-center mb-2">
        <h3 className="text-[#FF6347] text-xl dark:text-[#FF7B61] font-medium">Forgot Password</h3>
        <div className="w-full h-0.5 bg-[#FF6347] mt-2 mb-6"></div>
      </div>
      
      {!isSubmitted ? (
        <>
          <h2 className="text-3xl font-bold dark:text-gray-200 text-gray-800 mb-4">Reset your password</h2>
          
          <p className="text-gray-600 mb-6 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email address"
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              error={error}
              required
            />
            
            <Button 
              type="submit" 
              className="w-full bg-[#FF6347] hover:bg-[#FF5339] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Send Reset Link
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Check your email</h3>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to<br />
            <span className="font-medium">{email}</span>
          </p>
        </div>
      )}
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-[#FF6347] hover:underline text-sm"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 