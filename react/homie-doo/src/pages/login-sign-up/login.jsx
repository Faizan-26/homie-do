import React, { useState, useEffect } from 'react';

import './login.css';

function Login() {
  // Form visibility states
  const [activeForm, setActiveForm] = useState('login');
  
  // Form validation states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmailValid, setLoginEmailValid] = useState(true);
  const [loginPasswordValid, setLoginPasswordValid] = useState(true);
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [signupNameValid, setSignupNameValid] = useState(true);
  const [signupEmailValid, setSignupEmailValid] = useState(true);
  const [signupPasswordValid, setSignupPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailValid, setForgotEmailValid] = useState(true);
  
  // Validation regular expressions
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const nameRegex = /^[a-zA-Z ]{2,}$/;
  
  // Validation functions
  const validateEmail = (email) => {
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    return passwordRegex.test(password);
  };
  
  const validateName = (name) => {
    return nameRegex.test(name);
  };
  
  // Form handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(loginEmail);
    const isPasswordValid = loginPassword.length > 0;
    
    setLoginEmailValid(isEmailValid);
    setLoginPasswordValid(isPasswordValid);
    
    if (isEmailValid && isPasswordValid) {
      // Handle login logic here
      console.log('Login form is valid');
      alert('Login successful!');
    }
  };
  
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    
    const isNameValid = validateName(signupName);
    const isEmailValid = validateEmail(signupEmail);
    const isPasswordValid = validatePassword(signupPassword);
    const isConfirmPasswordValid = signupPassword === confirmPassword && confirmPassword.length > 0;
    const isTermsChecked = agreeTerms;
    
    setSignupNameValid(isNameValid);
    setSignupEmailValid(isEmailValid);
    setSignupPasswordValid(isPasswordValid);
    setConfirmPasswordValid(isConfirmPasswordValid);
    setTermsAgreed(isTermsChecked);
    
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsChecked) {
      // Handle signup logic here
      console.log('Signup form is valid');
      alert('Signup successful!');
    }
  };
  
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(forgotEmail);
    setForgotEmailValid(isEmailValid);
    
    if (isEmailValid) {
      // Handle forgot password logic here
      console.log('Forgot password form is valid');
      alert('Password reset link sent to your email!');
    }
  };
  
  return (
    <div className="login-container">
      {/* LEFT SECTION */}
      <div className="login-left-section">
        <div className="darkening-overlay"></div>
        <div className="login-left-content">
          <h1 className="my-heading">Welcome to Homie Doo</h1>
          <p className="login-subtitle" style={{ color: "whitesmoke" }}>
            Your ultimate academic companion - simplifying homework, providing expert study tips, 
            and helping you ace exams with personalized preparation strategies.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION - LOGIN/SIGNUP FORM */}
      <div className="login-right-section">
        <div className="form-container">
          {activeForm !== 'forgot' ? (
            <div className="form-toggle-buttons" id="mainToggleButtons">
              <button 
                onClick={() => setActiveForm('login')}
                className={`form-toggle-btn ${activeForm === 'login' ? 'active' : ''}`}
              >
                Login
              </button>
              <button 
                onClick={() => setActiveForm('signup')}
                className={`form-toggle-btn ${activeForm === 'signup' ? 'active' : ''}`}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="form-toggle-buttons">
              <button className="form-toggle-btn active">Forgot Password</button>
            </div>
          )}
          
          {/* LOGIN FORM */}
          {activeForm === 'login' && (
            <div className="auth-form">
              <h3>Login to your account</h3>
              <form onSubmit={handleLoginSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="loginEmail" className="form-label">Email address</label>
                  <input 
                    type="email" 
                    className={`form-control ${loginEmailValid ? '' : 'is-invalid'}`}
                    id="loginEmail" 
                    placeholder="Enter your email" 
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginEmailValid(validateEmail(e.target.value) || e.target.value === '');
                    }}
                    required 
                  />
                  {!loginEmailValid && (
                    <div className="error-message" style={{ display: 'block' }}>
                      Please enter a valid email address.
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="loginPassword" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className={`form-control ${loginPasswordValid ? '' : 'is-invalid'}`}
                    id="loginPassword" 
                    placeholder="Enter your password" 
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginPasswordValid(e.target.value.length > 0 || e.target.value === '');
                    }}
                    required 
                  />
                  {!loginPasswordValid && (
                    <div className="error-message" style={{ display: 'block' }}>
                      Password is required.
                    </div>
                  )}
                </div>
                <div className="mb-4 form-check">
                  <div>
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                  </div>
                  <div className="forgot-password">
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setActiveForm('forgot');
                    }}>Forgot password?</a>
                  </div>
                </div>
                <button type="submit" className="btn mybtn w-100">Login</button>
              </form>
            </div>
          )}
          
          {/* SIGNUP FORM */}
          {activeForm === 'signup' && (
            <div className="auth-form">
              <h3>Create an account</h3>
              <form onSubmit={handleSignupSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="signupName" className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className={`form-control ${signupNameValid ? '' : 'is-invalid'}`}
                    id="signupName" 
                    placeholder="Enter your full name" 
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      setSignupNameValid(validateName(e.target.value) || e.target.value === '');
                    }}
                    required 
                  />
                  {!signupNameValid && (
                    <div className="error-message" style={{ display: 'block' }}>
                      Please enter your full name.
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="signupEmail" className="form-label">Email address</label>
                  <input 
                    type="email" 
                    className={`form-control ${signupEmailValid ? '' : 'is-invalid'}`}
                    id="signupEmail" 
                    placeholder="Enter your email" 
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      setSignupEmailValid(validateEmail(e.target.value) || e.target.value === '');
                    }}
                    required 
                  />
                  {!signupEmailValid && (
                    <div className="error-message" style={{ display: 'block' }}>
                      Please enter a valid email address.
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="signupPassword" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className={`form-control ${signupPasswordValid ? '' : 'is-invalid'}`}
                    id="signupPassword" 
                    placeholder="Create a password" 
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      setSignupPasswordValid(validatePassword(e.target.value) || e.target.value === '');
                      // Update confirm password validation if it has a value
                      if (confirmPassword) {
                        setConfirmPasswordValid(e.target.value === confirmPassword);
                      }
                    }}
                    required 
                  />
                  {!signupPasswordValid && (
                    <div className="error-message" style={{ display: 'block' }}>
                      Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, one number and one special character.
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    className={`form-control ${confirmPasswordValid ? '' : 'is-invalid'}`}
                    id="confirmPassword" 
                    placeholder="Confirm your password" 
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordValid(signupPassword === e.target.value || e.target.value === '');
                    }}
                    required 
                  />
                  {!confirmPasswordValid && (
                    <div className="error-message" style={{ display: 'block' }}>
                      Passwords do not match.
                    </div>
                  )}
                </div>
                <div className="mb-4 form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="agreeTerms" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required 
                  />
                  <label className="form-check-label" htmlFor="agreeTerms">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </label>
                  {!termsAgreed && (
                    <div className="error-message" style={{ display: 'block' }}>
                      You must agree to the terms of service.
                    </div>
                  )}
                </div>
                <button type="submit" className="btn mybtn w-100">Sign Up</button>
              </form>
            </div>
          )}
          
          {/* FORGOT PASSWORD FORM */}
          {activeForm === 'forgot' && (
            <div className="auth-form">
              <h3>Reset your password</h3>
              <p className="mb-4">Enter your email address and we'll send you a link to reset your password.</p>
              <form onSubmit={handleForgotPasswordSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="forgotEmail" className="form-label">Email address</label>
                  <input 
                    type="email" 
                    className={`form-control ${forgotEmailValid ? '' : 'is-invalid'}`}
                    id="forgotEmail" 
                    placeholder="Enter your email" 
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      setForgotEmailValid(validateEmail(e.target.value) || e.target.value === '');
                    }}
                    required 
                  />
                  {!forgotEmailValid && (
                    <div className="error-message" style={{ display: 'block' }}>
                      Please enter a valid email address.
                    </div>
                  )}
                </div>
                <button type="submit" className="btn mybtn w-100">Send Reset Link</button>
                <div className="text-center mt-3">
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setActiveForm('login');
                  }}>Back to login</a>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
