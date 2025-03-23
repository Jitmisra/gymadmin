import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEquipment } from '../utils/api';
import { useGym } from '../context/GymContext';
import Button from '../components/UI/Button';
import './AddEquipmentPage.css';

const AddEquipmentPage = () => {
  const navigate = useNavigate();
  const { selectedGym } = useGym();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Equipment name is required');
      return;
    }
    
    if (!selectedGym || !selectedGym.id) {
      setError('No gym selected. Please select a gym before adding equipment.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare the equipment data with the gym ID
      const equipmentData = {
        ...formData,
        gymId: selectedGym.gymId || selectedGym.id, // Use gymId if available, otherwise fallback to id
        gym: selectedGym.name // Store the gym name for display purposes
      };
      
      console.log('Creating equipment for gym:', selectedGym);
      
      const result = await createEquipment(equipmentData, photo);
      console.log('Equipment created:', result);
      
      // Navigate back to equipment list
      navigate('/equipment');
    } catch (err) {
      console.error('Failed to create equipment:', err);
      setError(err.message || 'Failed to create equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-equipment-container">
      <div className="add-equipment-header">
        <h1>Add New Equipment</h1>
        <p>Add new equipment to {selectedGym?.name || 'your gym'}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="equipment-form">
        <div className="form-group">
          <label htmlFor="photo">Equipment Photo</label>
          <div 
            className="photo-upload" 
            onClick={() => document.getElementById('equipment-photo').click()}
            style={photoPreview ? { backgroundImage: `url(${photoPreview})` } : {}}
          >
            {!photoPreview && <span>Click to Upload Photo</span>}
          </div>
          <input 
            type="file" 
            id="equipment-photo" 
            accept="image/*" 
            onChange={handlePhotoChange} 
            style={{ display: 'none' }} 
          />
          <p className="form-hint">Optional: Upload an image of the equipment</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Equipment Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="out-of-order">Out of Order</option>
          </select>
        </div>
        
        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/equipment')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Equipment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEquipmentPage;
