import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGyms } from '../utils/api';
import './GymsPage.css';

const GymsPage = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadGyms = async () => {
      try {
        setLoading(true);
        const data = await fetchGyms();
        setGyms(data);
      } catch (err) {
        setError('Failed to load gyms data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGyms();
  }, []);

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         gym.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || gym.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="gyms-loading">Loading gyms data...</div>;
  }

  if (error) {
    return <div className="gyms-error">{error}</div>;
  }

  return (
    <div className="gyms-container">
      <div className="gyms-header">
        <h1>Gyms Management</h1>
        <Link to="/gyms/new" className="create-gym-btn">Add New Gym</Link>
      </div>

      <div className="gyms-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search gyms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <label htmlFor="status-filter">Filter by status:</label>
          <select 
            id="status-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="gyms-list">
        {filteredGyms.length > 0 ? (
          filteredGyms.map(gym => (
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
          ))
        ) : (
          <div className="no-results">No gyms found matching your criteria</div>
        )}
      </div>
    </div>
  );
};

export default GymsPage;