import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import Button from '../components/UI/Button';
import { createMember } from '../utils/api';
import './AddMemberPage.css';

const AddMemberPage = () => {
  const navigate = useNavigate();
  const { selectedGym } = useGym();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a member data object
      const memberData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gymId: selectedGym.id
      };
      
      // Call the API to create a new member
      await createMember(memberData);
      
      // Redirect to members page on success
      navigate('/members');
    } catch (error) {
      console.error('Error creating member:', error);
      setErrors({ submit: 'Failed to create member. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-member-container">
      <div className="add-member-header">
        <h1>Add New Member to {selectedGym.name}</h1>
      </div>
      
      <form className="member-form" onSubmit={handleSubmit}>
        {errors.submit && <div className="form-error">{errors.submit}</div>}
        
        <div className="form-section">
          <h2>Member Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
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
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="input-error">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
          </div>
        </div>
        
        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/members')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Member'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberPage;
