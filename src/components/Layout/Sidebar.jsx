import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, onToggle, onLinkClick }) => {
  const { user, logout } = useAuth();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="logo">Gym Admin</h2>
        <button className="toggle-btn" onClick={onToggle}>
          {isCollapsed ? '≫' : '≪'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={onLinkClick}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink 
          to="/gyms" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={onLinkClick}
        >
          <span className="nav-icon">🏢</span>
          <span className="nav-text">Gyms</span>
        </NavLink>
        <NavLink 
          to="/members" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={onLinkClick}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-text">Users</span>
        </NavLink>
        <NavLink 
          to="/equipment" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={onLinkClick}
        >
          <span className="nav-icon">🏋️</span>
          <span className="nav-text">Equipment</span>
        </NavLink>
        <NavLink 
          to="/tickets" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={onLinkClick}
        >
          <span className="nav-icon">🎫</span>
          <span className="nav-text">Tickets</span>
        </NavLink>
        <NavLink 
          to="/community" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={onLinkClick}
        >
          <span className="nav-icon">💬</span>
          <span className="nav-text">Community</span>
        </NavLink>
        {/* Settings link removed */}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">Admin</span> {/* Always show Admin */}
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;