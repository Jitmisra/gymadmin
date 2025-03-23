import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import './AddGymPage.css';
import { useGym } from '../context/GymContext';
import { createGym } from '../utils/api';

const EQUIPMENT_LIST = [
  { id: 1, name: 'Treadmill' },
  { id: 2, name: 'Exercise Bike' },
  { id: 3, name: 'Elliptical' },
  { id: 4, name: 'Rowing Machine' },
  { id: 5, name: 'Stair Mill' },
  { id: 6, name: 'Weight Bench' },
  { id: 7, name: 'Smith Machine' },
  { id: 8, name: 'Squat Rack' },
  { id: 9, name: 'Dumbbells Set' },
  { id: 10, name: 'Barbells' },
  { id: 11, name: 'Kettlebells' },
  { id: 12, name: 'Yoga Mats' },
  { id: 13, name: 'Medicine Balls' },
  { id: 14, name: 'Pull-up Bar' },
  { id: 15, name: 'Leg Press Machine' }
];

const AddGymPage = () => {
  const navigate = useNavigate();
  const { addGym } = useGym();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    openTime: '06:00',
    closeTime: '22:00',
    isActive: true,
    equipment: []
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'equipment') {
      const equipmentId = parseInt(value);
      
      setFormData(prev => {
        if (checked) {
          return { ...prev, equipment: [...prev.equipment, equipmentId] };
        } else {
          return { ...prev, equipment: prev.equipment.filter(id => id !== equipmentId) };
        }
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
    
    if (!formData.name.trim()) newErrors.name = 'Gym name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!photo) newErrors.photo = 'Gym photo is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the gym data object
      const gymData = {
        name: formData.name,
        address: formData.address,
        contactNumber: formData.contactNumber,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        isActive: formData.isActive,
        status: formData.isActive ? 'active' : 'inactive',
        equipment: formData.equipment,
        location: formData.address.split(',')[0].trim(), // Simplified location extraction
        members: 0, // New gyms start with 0 members
        gymId: 4 // Use the next gymId after 2 (Main Campus) and 3 (North Campus)
      };
      
      // Call the API to create a new gym
      const newGym = await createGym(gymData);
      console.log('New gym created:', newGym);
      
      // Add to context and select the new gym
      addGym(newGym);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating gym:', error);
      setErrors({ submit: 'Failed to create gym. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-gym-container">
      <div className="add-gym-header">
        <h1>Add New Gym</h1>
      </div>
      
      <form className="gym-form" onSubmit={handleSubmit}>
        {errors.submit && <div className="form-error">{errors.submit}</div>}
        
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="photo-upload-container">
            <div 
              className="photo-upload" 
              onClick={() => document.getElementById('gym-photo').click()}
              style={photoPreview ? { backgroundImage: `url(${photoPreview})` } : {}}
            >
              {!photoPreview && <span>Click to Upload Gym Photo</span>}
            </div>
            <input 
              type="file" 
              id="gym-photo" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              style={{ display: 'none' }} 
            />
            {errors.photo && <div className="input-error">{errors.photo}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Gym Name</label>
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
            <label htmlFor="address">Address</label>
            <textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange} 
              className={errors.address ? 'error' : ''}
            ></textarea>
            {errors.address && <div className="input-error">{errors.address}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input 
              type="tel" 
              id="contactNumber" 
              name="contactNumber" 
              value={formData.contactNumber} 
              onChange={handleInputChange} 
              className={errors.contactNumber ? 'error' : ''}
            />
            {errors.contactNumber && <div className="input-error">{errors.contactNumber}</div>}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Operating Hours</h2>
          
          <div className="time-inputs">
            <div className="form-group">
              <label htmlFor="openTime">Opening Time</label>
              <input 
                type="time" 
                id="openTime" 
                name="openTime" 
                value={formData.openTime} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="closeTime">Closing Time</label>
              <input 
                type="time" 
                id="closeTime" 
                name="closeTime" 
                value={formData.closeTime} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Equipment</h2>
          <p className="section-description">Select all equipment available at this gym</p>
          
          <div className="equipment-checklist">
            {EQUIPMENT_LIST.map(item => (
              <div key={item.id} className="checkbox-item">
                <input 
                  type="checkbox" 
                  id={`equipment-${item.id}`}
                  name="equipment"
                  value={item.id}
                  checked={formData.equipment.includes(item.id)}
                  onChange={handleInputChange}
                />
                <label htmlFor={`equipment-${item.id}`}>{item.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Status</h2>
          
          <div className="status-toggle">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                name="isActive" 
                checked={formData.isActive} 
                onChange={handleInputChange}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/gyms')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Gym'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGymPage;
