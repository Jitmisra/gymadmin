import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGyms } from '../../utils/api';
import './GymList.css';

const GymList = ({ limit }) => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGyms = async () => {
      try {
        setLoading(true);
        const data = await fetchGyms();
        setGyms(limit ? data.slice(0, limit) : data);
      } catch (err) {
        setError('Failed to load gyms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGyms();
  }, [limit]);

  if (loading) {
    return <div className="gym-list-loading">Loading gyms...</div>;
  }

  if (error) {
    return <div className="gym-list-error">{error}</div>;
  }

  if (gyms.length === 0) {
    return <div className="no-gyms">No gyms found</div>;
  }

  return (
    <div className="gym-list">
      {gyms.map(gym => (
        <div key={gym.id} className="gym-card">
          <div className="gym-header">
            <h3>{gym.name}</h3>
            <span className={`status-badge status-${gym.status}`}>
              {gym.status}
            </span>
          </div>
          <div className="gym-details">
            <p><strong>Location:</strong> {gym.location}</p>
            <p><strong>Members:</strong> {gym.members}</p>
          </div>
          <div className="gym-actions">
            <Link to={`/gyms/${gym.id}/edit`} className="action-btn edit-btn">
              Edit
            </Link>
            <button
              className="action-btn delete-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this gym?')) {
                  console.log(`Delete gym with ID: ${gym.id}`);
                  // API call would go here
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      
      {limit && gyms.length >= limit && (
        <div className="view-all-container">
          <Link to="/gyms" className="view-all-link">View All Gyms</Link>
        </div>
      )}
    </div>
  );
};

export default GymList;