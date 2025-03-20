import React from 'react';
import { Link } from 'react-router-dom';
import { useGym } from '../../context/GymContext';
import './DashboardStats.css';

const DashboardStats = ({ stats = {} }) => {
  const { selectedGym } = useGym();
  
  // Add default empty objects to ensure these properties exist
  const { 
    users = { total: 0, members: 0, admins: 0 }, 
    gyms = { total: 0 }, 
    equipment = { total: 0, working: 0, damaged: 0 }, 
    tickets = { total: 0, pending: 0, solved: 0 } 
  } = stats;

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Users</h3>
        <div className="stat-value">{users.total || 0}</div>
        <div className="stat-breakdown">
          <div className="stat-subitem">
            <span className="stat-label">Members</span>
            <span className="stat-subvalue">{users.members || 0}</span>
          </div>
          <div className="stat-subitem">
            <span className="stat-label">Admins</span>
            <span className="stat-subvalue">{users.admins || 0}</span>
          </div>
        </div>
        <Link to="/members" className="stat-link">View Members</Link>
      </div>

      {!selectedGym && (
        <div className="stat-card">
          <h3>Gyms</h3>
          <div className="stat-value">{gyms.total || 0}</div>
          <Link to="/gyms" className="stat-link">View all gyms</Link>
        </div>
      )}

      <div className="stat-card">
        <h3>Equipment</h3>
        <div className="stat-value">{equipment.total || 0}</div>
        <div className="stat-breakdown">
          <div className="stat-subitem">
            <span className="stat-label">Working</span>
            <span className="stat-subvalue">{equipment.working || 0}</span>
          </div>
          <div className="stat-subitem">
            <span className="stat-label">Needs Maintenance</span>
            <span className="stat-subvalue">{equipment.damaged || 0}</span>
          </div>
        </div>
        <Link to="/equipment" className="stat-link">View Equipment</Link>
      </div>

      <div className="stat-card">
        <h3>Tickets</h3>
        <div className="stat-value">{tickets.total || 0}</div>
        <div className="stat-breakdown">
          <div className="stat-subitem">
            <span className="stat-label">Pending</span>
            <span className="stat-subvalue">{tickets.pending || 0}</span>
          </div>
          <div className="stat-subitem">
            <span className="stat-label">Solved</span>
            <span className="stat-subvalue">{tickets.solved || 0}</span>
          </div>
        </div>
        <Link to="/tickets" className="stat-link">View Tickets</Link>
      </div>
    </div>
  );
};

export default DashboardStats;