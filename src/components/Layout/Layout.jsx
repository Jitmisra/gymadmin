import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import GymSwitcher from './GymSwitcher';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const { selectedGym } = useGym();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, [location]);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div className={`app-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Dark overlay behind sidebar on mobile */}
      <div 
        className="sidebar-overlay" 
        onClick={toggleSidebar}
      ></div>
      
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">Gym Admin</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarCollapsed ? '≫' : '≪'}
          </button>
        </div>
        
        {/* Add Gym Switcher */}
        <GymSwitcher collapsed={isSidebarCollapsed} />
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink 
            to="/gyms" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">🏢</span>
            <span className="nav-text">Gyms</span>
          </NavLink>
          <NavLink 
            to="/members" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Users</span>
          </NavLink>
          <NavLink 
            to="/admins" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">👨‍💼</span>
            <span className="nav-text">Admins</span>
          </NavLink>
          <NavLink 
            to="/equipment" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">🏋️</span>
            <span className="nav-text">Equipment</span>
          </NavLink>
          <NavLink 
            to="/tickets" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">🎫</span>
            <span className="nav-text">Tickets</span>
          </NavLink>
          <NavLink 
            to="/community" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={closeSidebarOnMobile}
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
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="content">
        <header className="top-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn" 
              onClick={toggleSidebar} 
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
        
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
