import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGym } from '../../context/GymContext';
import './GymSwitcher.css';

const GymSwitcher = ({ collapsed }) => {
  const { selectedGym, gyms, selectGym } = useGym();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Make sure we handle the case when gyms array might be undefined or null
  const safeGyms = Array.isArray(gyms) ? gyms : [];

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleGymChange = (gym) => {
    selectGym(gym);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`gym-switcher ${collapsed ? 'collapsed' : ''}`} ref={dropdownRef}>
      <div className="current-gym" onClick={toggleDropdown}>
        <div className="gym-icon">🏢</div>
        {!collapsed && (
          <>
            <div className="gym-info">
              <span className="gym-name">{selectedGym ? selectedGym.name : 'Select Gym'}</span>
              {selectedGym && <span className="gym-location">{selectedGym.location}</span>}
            </div>
            <div className="dropdown-arrow">{isOpen ? '▲' : '▼'}</div>
          </>
        )}
      </div>
      
      {isOpen && !collapsed && (
        <div className="gym-dropdown">
          <div className="dropdown-header">
            <h4>Switch Gym</h4>
          </div>
          <div className="gym-list">
            {safeGyms.map(gym => (
              <div 
                key={gym.id} 
                className={`gym-item ${selectedGym && gym.id === selectedGym.id ? 'active' : ''}`}
                onClick={() => handleGymChange(gym)}
              >
                <span className="gym-item-name">{gym.name}</span>
                <span className="gym-item-location">{gym.location}</span>
              </div>
            ))}
          </div>
          <div className="dropdown-footer">
            <Link to="/select-gym" className="all-gyms-link">
              View All Gyms
            </Link>
            <Link to="/gyms/new" className="new-gym-link">
              + Add New Gym
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymSwitcher;
