import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import { fetchMembersByGym } from '../utils/api';
import Button from '../components/UI/Button';
import './MembersPage.css';

const MembersPage = () => {
  const { selectedGym } = useGym();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      if (!selectedGym) return;
      
      try {
        setLoading(true);
        const data = await fetchMembersByGym(selectedGym.id);
        setMembers(data);
      } catch (err) {
        setError('Failed to load members data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [selectedGym]);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetPassword = (member) => {
    setSelectedMember(member);
    setShowResetModal(true);
  };

  const confirmResetPassword = async () => {
    try {
      setIsSubmitting(true);
      // API call to reset the password
      console.log(`Reset password for member: ${selectedMember.email}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (could use a toast notification in a real app)
      alert('Password has been reset successfully');
      
      setShowResetModal(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="members-loading">Loading members data...</div>;
  }

  if (error) {
    return <div className="members-error">{error}</div>;
  }

  return (
    <div className="members-container">
      <div className="members-header">
        <h1>{selectedGym.name} - Members</h1>
        <Link to="/members/new" className="add-member-btn">Add New Member</Link>
      </div>

      <div className="members-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="members-list">
        <div className="members-list-header">
          <div className="member-name-col">Name</div>
          <div className="member-email-col">Email</div>
          <div className="member-actions-col">Actions</div>
        </div>
        
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <div key={member.id} className="member-item">
              <div className="member-name-col">
                <div className="member-avatar">{member.name.charAt(0)}</div>
                <div className="member-name">{member.name}</div>
              </div>
              <div className="member-email-col">{member.email}</div>
              <div className="member-actions-col">
                <Button 
                  size="small" 
                  variant="secondary"
                  onClick={() => handleResetPassword(member)}
                >
                  Reset Password
                </Button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
                      console.log(`Delete member with ID: ${member.id}`);
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
          <div className="no-members">
            {searchTerm 
              ? "No members found matching your search." 
              : "No members found. Add your first member!"}
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <p>Are you sure you want to reset the password for <strong>{selectedMember?.name}</strong>?</p>
            <p>A temporary password will be sent to their email: <strong>{selectedMember?.email}</strong></p>
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

export default MembersPage;
