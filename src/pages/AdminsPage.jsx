import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdmins, resetAdminPassword, deleteAdmin } from '../utils/api';
import Button from '../components/UI/Button';
import './AdminsPage.css';

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        setLoading(true);
        const data = await fetchAdmins();
        setAdmins(data);
      } catch (err) {
        setError('Failed to load administrators data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetPassword = (admin) => {
    setSelectedAdmin(admin);
    setShowResetModal(true);
  };

  const confirmResetPassword = async () => {
    try {
      setIsSubmitting(true);
      // API call to reset the password
      await resetAdminPassword(selectedAdmin.id);
      
      // Show success message
      alert('Password has been reset successfully.');
      
      setShowResetModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (window.confirm(`Are you sure you want to delete admin: ${adminName}?`)) {
      try {
        setLoading(true);
        await deleteAdmin(adminId);
        
        // Remove the deleted admin from the state
        setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== adminId));
        
        // Show success message
        alert(`Administrator ${adminName} has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting administrator:', error);
        setError('Failed to delete administrator. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="admins-loading">Loading administrators data...</div>;
  }

  if (error) {
    return <div className="admins-error">{error}</div>;
  }

  return (
    <div className="admins-container">
      <div className="admins-header">
        <h1>System Administrators</h1>
        <Link to="/admins/new" className="add-admin-btn">Add New Admin</Link>
      </div>

      <div className="admins-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search administrators by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admins-list">
        <div className="admins-list-header">
          <div className="admin-name-col">Name</div>
          <div className="admin-email-col">Email</div>
          <div className="admin-role-col">Role</div>
          <div className="admin-actions-col">Actions</div>
        </div>
        
        {filteredAdmins.length > 0 ? (
          filteredAdmins.map(admin => (
            <div key={admin.id} className="admin-item">
              <div className="admin-name-col">
                <div className="admin-avatar">{admin.name.charAt(0)}</div>
                <div className="admin-name">{admin.name}</div>
              </div>
              <div className="admin-email-col">{admin.email}</div>
              <div className="admin-role-col">
                <span className={`role-badge role-${admin.role.toLowerCase()}`}>
                  {admin.role}
                </span>
              </div>
              <div className="admin-actions-col">
                <Button 
                  size="small" 
                  variant="secondary"
                  onClick={() => handleResetPassword(admin)}
                >
                  Reset Password
                </Button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-admins">
            {searchTerm 
              ? "No administrators found matching your search." 
              : "No administrators found. Add your first admin!"}
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Administrator Password</h3>
            <p>Are you sure you want to reset the password for <strong>{selectedAdmin?.name}</strong>?</p>
            <p>A temporary password will be sent to their email: <strong>{selectedAdmin?.email}</strong></p>
            <div className="modal-actions">
              <Button 
                variant="secondary" 
                onClick={() => setShowResetModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={confirmResetPassword}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsPage;
