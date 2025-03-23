import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEquipmentByGym, updateEquipmentStatus } from '../../utils/api';
import { useGym } from '../../context/GymContext';
import './EquipmentList.css';

const EquipmentList = ({ limit }) => {
  const { selectedGym } = useGym();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadEquipment = async () => {
      if (!selectedGym) return;
      
      try {
        setLoading(true);
        // Use gymId instead of id - this is the key fix
        const gymIdToUse = selectedGym.gymId || selectedGym.id;
        console.log('Fetching equipment for gym ID:', gymIdToUse);
        const data = await fetchEquipmentByGym(gymIdToUse);
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

  const handleStatusChange = async (equipmentId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Provide more descriptive console info
      console.log(`Attempting to update equipment ID ${equipmentId} to status: ${newStatus}`);
      
      await updateEquipmentStatus(equipmentId, newStatus);
      
      // Update the local state with the new status
      setEquipment(prevEquipment => 
        prevEquipment.map(item => 
          item.id === equipmentId ? { ...item, status: newStatus } : item
        )
      );
      
      // Show success message
      alert(`Equipment status successfully updated to ${newStatus}`);
      
    } catch (err) {
      console.error('Failed to update equipment status:', err);
      
      // More descriptive error message to the user
      alert(`Failed to update status: ${err.message || 'Unknown error occurred'}`);
      
      // Reset the dropdown to the previous value by re-fetching data
      if (selectedGym) {
        const gymIdToUse = selectedGym.gymId || selectedGym.id;
        try {
          const refreshedData = await fetchEquipmentByGym(gymIdToUse);
          setEquipment(limit ? refreshedData.slice(0, limit) : refreshedData);
        } catch (refreshError) {
          console.error('Failed to refresh equipment data:', refreshError);
        }
      }
    } finally {
      setIsUpdating(false);
    }
  };

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
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-order">Out of Order</option>
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
                    <div className="status-section">
                      <span className={`status-badge status-${item.status.replace(/\s+/g, '-')}`}>
                        {item.status}
                      </span>
                      <div className="status-dropdown">
                        <select 
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          disabled={isUpdating}
                        >
                          <option value="active">Active</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="out-of-order">Out of Order</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="actions">
                    {/* Edit button removed */}
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