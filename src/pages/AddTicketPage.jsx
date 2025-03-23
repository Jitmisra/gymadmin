import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import { createTicket } from '../utils/api';
import Button from '../components/UI/Button';
import './AddTicketPage.css';

const AddTicketPage = () => {
  const navigate = useNavigate();
  const { selectedGym } = useGym();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issuerEmail: '',
    status: 'open',
    ticketType: 'user' // Default to "user" type
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
    
    if (!formData.title.trim()) newErrors.title = 'Issue title is required';
    if (!formData.description.trim()) newErrors.description = 'Issue description is required';
    if (!formData.issuerEmail.trim()) newErrors.issuerEmail = 'Issuer email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.issuerEmail)) newErrors.issuerEmail = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simplified data structure - only pass what's needed for display
      const ticketData = {
        title: formData.title,
        description: formData.description,
        issuerEmail: formData.issuerEmail,
        status: formData.status,
        gymId: selectedGym.id,
        gym: selectedGym.name,
        // We don't need to pass userId here as it will be hardcoded in the API function
      };
      
      console.log('Submitting ticket data:', ticketData); // For debugging
      
      await createTicket(ticketData);
      
      navigate('/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      setErrors({ submit: `Failed to create ticket: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-ticket-container">
      <div className="add-ticket-header">
        <h1>Create New Ticket for {selectedGym.name}</h1>
      </div>
      
      <form className="ticket-form" onSubmit={handleSubmit}>
        {errors.submit && <div className="form-error">{errors.submit}</div>}
        
        <div className="form-section">
          <h2>Ticket Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">Issue Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              className={errors.title ? 'error' : ''}
              placeholder="Brief title of the issue"
            />
            {errors.title && <div className="input-error">{errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Issue Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              className={errors.description ? 'error' : ''}
              placeholder="Detailed description of the issue..."
              rows={5}
            ></textarea>
            {errors.description && <div className="input-error">{errors.description}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="issuerEmail">Issuer Email</label>
            <input 
              type="email" 
              id="issuerEmail" 
              name="issuerEmail" 
              value={formData.issuerEmail} 
              onChange={handleInputChange} 
              className={errors.issuerEmail ? 'error' : ''}
              placeholder="Email of the person reporting the issue"
            />
            {errors.issuerEmail && <div className="input-error">{errors.issuerEmail}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="ticketType">Ticket Type</label>
            <select
              id="ticketType"
              name="ticketType"
              value={formData.ticketType}
              onChange={handleInputChange}
            >
              <option value="user">User Issue</option>
              <option value="equipment">Equipment Problem</option>
              <option value="facility">Facility Maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/tickets')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTicketPage;
