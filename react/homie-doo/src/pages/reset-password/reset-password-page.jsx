import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';
import FormInput from '../login/components/FormInput';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [errors, setErrors] = useState({});
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    // Verify token on component mount - this is optional and can be skipped if your API doesn't provide verification
    const verifyToken = async () => {
      try {
        // Using direct reset-password/:token route without verification to check if token is valid
        // If your backend doesn't provide a separate verification endpoint, you can remove this check
        // or adjust based on your API structure
        setTokenValid(true); // Assume token is valid initially
      } catch (error) {
        console.error('Error verifying token:', error);
        setTokenValid(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
    }
  }, [token]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

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
    
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
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
      setLoading(true);
      setError('');
      
      try {
        // Use the route format provided by the user: /auth/reset-password/:token
        const response = await fetch(`${config.api.baseUrl}/api/auth/reset-password/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: formData.password
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setSuccess(true);
          
          // If the API returns a token and user, we can log them in automatically
          if (data.token && data.user) {
            login(data.user, data.token);
            
            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          } else {
            // Otherwise redirect to login
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          }
        } else {
          setError(data.message || 'Failed to reset password');
        }
      } catch (error) {
        console.error('Reset password error:', error);
        setError('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Show invalid token message if token is invalid
  if (!tokenValid) {
    return (
      <div className="min-h-screen w-full relative overflow-x-hidden md:overflow-hidden bg-gray-50 dark:bg-[#1a1f2d] transition-colors duration-200">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>

        {/* SVG Background with Blur Overlay */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/40 z-10"></div>
          <img 
            src="/login-bg.svg" 
            alt="Background" 
            className="h-full w-full object-cover opacity-100 dark:opacity-30"
          />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md bg-white dark:bg-[#1e2538] bg-opacity-90 dark:bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg dark:shadow-2xl p-8 mx-4">
            <div className="text-center">
              <h3 className="text-[#FF6347] text-xl dark:text-[#FF7B61] font-medium">Invalid Reset Link</h3>
              <div className="w-full h-0.5 bg-[#FF6347] mt-2 mb-6"></div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The password reset link is invalid or has expired.
              </p>
              
              <Button 
                onClick={() => navigate('/login')}
                className="bg-[#FF6347] hover:bg-[#FF5339] text-white font-medium"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden md:overflow-hidden bg-gray-50 dark:bg-[#1a1f2d] transition-colors duration-200">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      {/* SVG Background with Blur Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 z-10"></div>
        <img 
          src="/login-bg.svg" 
          alt="Background" 
          className="h-full w-full object-cover opacity-100 dark:opacity-30"
        />
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white dark:bg-[#1e2538] bg-opacity-90 dark:bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg dark:shadow-2xl p-8 mx-4">
          <div className="text-center mb-2">
            <h3 className="text-[#FF6347] text-xl dark:text-[#FF7B61] font-medium">Reset Password</h3>
            <div className="w-full h-0.5 bg-[#FF6347] mt-2 mb-6"></div>
          </div>
          
          {success ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Password Updated!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your password has been reset successfully.
                <br /><br />
                You will be redirected shortly...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold dark:text-gray-200 text-gray-800 mb-4">Create a new password</h2>
              
              <p className="text-gray-600 mb-6 dark:text-gray-400">
                Your new password must be different from previously used passwords.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  label="New Password"
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                
                <FormInput
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#FF6347] hover:bg-[#FF5339] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? 'Updating Password...' : 'Reset Password'}
                </Button>
              </form>
              
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#FF6347] hover:underline text-sm"
                >
                  Back to login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 