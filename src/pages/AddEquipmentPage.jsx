import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import Button from '../components/UI/Button';
import './AddEquipmentPage.css';

const AddEquipmentPage = () => {
  const navigate = useNavigate();
  const { selectedGym } = useGym();
  const [formData, setFormData] = useState({
    name: '',
    status: 'operational',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Equipment name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the photo and create the equipment
      console.log('Creating new equipment:', {
        name: formData.name,
        status: formData.status,
        gymId: selectedGym.id,
        hasPhoto: !!photo
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to equipment page on success
      navigate('/equipment');
    } catch (error) {
      console.error('Error creating equipment:', error);
      setErrors({ submit: 'Failed to create equipment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-equipment-container">
      <div className="add-equipment-header">
        <h1>Add New Equipment to {selectedGym.name}</h1>
      </div>
      
      <form className="equipment-form" onSubmit={handleSubmit}>
        {errors.submit && <div className="form-error">{errors.submit}</div>}
        
        <div className="form-section">
          <h2>Equipment Information</h2>
          
          <div className="photo-upload-container">
            <div 
              className="photo-upload" 
              onClick={() => document.getElementById('equipment-photo').click()}
              style={photoPreview ? { backgroundImage: `url(${photoPreview})` } : {}}
            >
              {!photoPreview && <span>Click to Upload Equipment Photo</span>}
            </div>
            <input 
              type="file" 
              id="equipment-photo" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              style={{ display: 'none' }} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Equipment Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="input-error">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="operational">Operational</option>
              <option value="maintenance">Needs Maintenance</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/equipment')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Equipment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEquipmentPage;
