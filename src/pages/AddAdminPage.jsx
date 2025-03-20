import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdmin } from '../utils/api';
import Button from '../components/UI/Button';
import './AddAdminPage.css';

const AddAdminPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Role is now fixed as 'Admin' and not included in form state
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Always set role as Admin
      const adminData = {
        ...formData,
        role: 'Admin'
      };
      
      await createAdmin(adminData);
      navigate('/admins');
    } catch (err) {
      setError('Failed to create admin. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-admin-container">
      <div className="add-admin-header">
        <h1>Add New Admin</h1>
      </div>

      <div className="admin-form-container">
        {error && <div className="form-error">{error}</div>}
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            {/* Replace dropdown with static text showing only Admin role */}
            <div className="static-field">Admin</div>
          </div>

          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/admins')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Admin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminPage;
