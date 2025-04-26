import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import './styles.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', 'forgot'
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

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

  // Show loading if we're still checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#1a1f2d]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6347] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
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
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen py-8 md:py-0 flex md:block">
        {/* Left Side Heading */}
        <div className="hidden md:block fixed left-[6%] top-30 text-[#FF6347] space-y-2">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#FF6347] dark:text-[#FF7B61] leading-tight tracking-tight mb-8">
              Get Started with <br /> Homie Doo
            </h2>
          </div>
        </div>

        {/* Login/Signup Form Container */}
        <div className="flex flex-col items-center justify-center w-full px-4 md:block md:absolute md:top-1/2 md:right-[10%] md:transform md:-translate-y-1/2 md:w-[450px]">
          {/* Mobile Only Heading */}
          <h1 className="md:hidden text-3xl font-bold text-[#FF6347] dark:text-[#FF7B61] text-center mb-6">
            Get Started with homie doo
          </h1>

          <div className="w-full max-w-md md:w-full bg-white dark:bg-[#1e2538] bg-opacity-90 dark:bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg dark:shadow-2xl p-8">
            {activeTab !== 'forgot' ? (
              <>
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700/30 mb-6">
                  <button
                    className={`flex-1 pb-2 text-lg font-medium transition-all duration-300 ${
                      activeTab === 'login'
                        ? 'text-[#FF6347] border-b-2 border-[#FF6347] transform scale-105'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </button>
                  <button
                    className={`flex-1 pb-2 text-lg font-medium transition-all duration-300 ${
                      activeTab === 'signup'
                        ? 'text-[#FF6347] border-b-2 border-[#FF6347] transform scale-105'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form Components */}
                {activeTab === 'login' && <LoginForm onForgotPassword={() => setActiveTab('forgot')} isDark={isDark} />}
                {activeTab === 'signup' && <SignupForm isDark={isDark} />}
              </>
            ) : (
              <ForgotPasswordForm onBackToLogin={() => setActiveTab('login')} isDark={isDark} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
