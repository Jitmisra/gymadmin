import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import './Header.css';

const Header = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const { selectedGym } = useGym();
  
  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onMenuToggle} 
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h2 className="page-title">
          {selectedGym ? selectedGym.name : 'Gym Admin Panel'}
        </h2>
      </div>
      <div className="header-right">
        <div className="user-dropdown">
          <span className="user-greeting">Hello, {user?.name || 'User'}</span>
          <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;