import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the Google Sign-In API script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = initializeGoogleButton;
    };

    // Initialize Google Sign-In button
    const initializeGoogleButton = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignInCallback
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'outline', 
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'center',
            width: 280
          }
        );
      }
    };

    loadGoogleScript();

    return () => {
      // Clean up if needed
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle the Google Sign-In callback
  const handleGoogleSignInCallback = async (response) => {
    try {
      if (response.credential) {
        // Send the ID token to your backend
        const result = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: response.credential }),
          credentials: 'include'
        });

        const data = await result.json();

        if (result.ok) {
          // Store token and user data
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Call the success callback
          if (onLoginSuccess) {
            onLoginSuccess(data);
          }
          
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          console.error('Google login failed:', data.message);
        }
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
    }
  };

  return (
    <div className="google-login-container">
      <div id="google-signin-button"></div>
    </div>
  );
};

export default GoogleLogin; 