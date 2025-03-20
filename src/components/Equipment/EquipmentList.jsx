import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEquipmentByGym } from '../../utils/api';
import { useGym } from '../../context/GymContext';
import './EquipmentList.css';

const EquipmentList = ({ limit }) => {
  const { selectedGym } = useGym();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadEquipment = async () => {
      if (!selectedGym) return;
      
      try {
        setLoading(true);
        // Fetch equipment specific to the selected gym
        const data = await fetchEquipmentByGym(selectedGym.id);
        setEquipment(limit ? data.slice(0, limit) : data);
      } catch (err) {
        setError('Failed to load equipment data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [selectedGym, limit]);

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDeleteEquipment = (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      console.log(`Delete equipment with ID: ${id}`);
      // API call would go here
    }
  };

  if (loading) {
    return <div className="equipment-loading">Loading equipment data...</div>;
  }

  if (error) {
    return <div className="equipment-error">{error}</div>;
  }

  return (
    <div className="equipment-container">
      {!limit && (
        <div className="equipment-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search equipment..."
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
              <option value="all">All Status</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Needs Maintenance</option>
            </select>
          </div>
        </div>
      )}

      <div className="equipment-list">
        <table>
          <thead>
            <tr>
              <th className="equipment-photo-col">Photo</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map(item => (
                <tr key={item.id}>
                  <td className="equipment-photo-col">
                    <div className="equipment-photo">
                      {item.photoUrl ? (
                        <img src={item.photoUrl} alt={item.name} />
                      ) : (
                        <div className="no-photo">No Image</div>
                      )}
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <span className={`status-badge status-${item.status.replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/equipment/${item.id}/edit`} className="action-btn edit-btn">
                      Edit
                    </Link>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteEquipment(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">No equipment found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {limit && equipment.length >= limit && (
        <div className="view-all-container">
          <Link to="/equipment" className="view-all-link">View All Equipment</Link>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;