import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-brand">
            <h1>Gym Admin</h1>
            <p>Control your gyms at your fingertips</p>
          </div>
          <LoginForm />
        </div>
        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} Gym Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;