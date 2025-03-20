import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import Button from '../components/UI/Button';
import './GymSelectionPage.css';

const GymSelectionPage = () => {
  const { gyms, loading, error, selectGym } = useGym();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredGyms = gyms.filter(gym => 
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    gym.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGymSelect = (gym) => {
    selectGym(gym);
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="gym-selection-loading">Loading gyms...</div>;
  }

  if (error) {
    return <div className="gym-selection-error">{error}</div>;
  }

  return (
    <div className="gym-selection-page">
      <div className="gym-selection-container">
        <div className="gym-selection-header">
          <h1>Welcome to Gym Admin</h1>
          <p>Select a gym to manage or create a new one</p>
        </div>

        <div className="gym-selection-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search gyms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gym-search-input"
            />
          </div>
          <Link to="/gyms/new" className="create-gym-button">
            <span className="icon">+</span>
            Create New Gym
          </Link>
        </div>

        <div className="gyms-grid">
          {filteredGyms.length > 0 ? (
            filteredGyms.map(gym => (
              <div 
                key={gym.id} 
                className="gym-card"
                onClick={() => handleGymSelect(gym)}
              >
                <div className="gym-card-content">
                  <h3>{gym.name}</h3>
                  <p className="gym-location">{gym.location}</p>
                  <div className="gym-meta">
                    <span className={`gym-status status-${gym.status}`}>
                      {gym.status}
                    </span>
                    <span className="gym-members">
                      {gym.members} members
                    </span>
                  </div>
                </div>
                <div className="gym-card-action">
                  <Button>Select</Button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-gyms-found">
              <p>No gyms found matching your search.</p>
              <Link to="/gyms/new" className="create-gym-link">
                Create a new gym instead?
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymSelectionPage;
