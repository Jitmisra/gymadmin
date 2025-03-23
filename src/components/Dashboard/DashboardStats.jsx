import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardStats.css';

const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      <div className="stats-card">
        <div className="stats-icon users-icon">👥</div>
        <div className="stats-content">
          <h3 className="stats-title">Users</h3>
          <div className="stats-count">{stats.users.total}</div>
          <div className="stats-details">
            <div className="stats-detail">
              <span className="detail-label">Members:</span>
              <span className="detail-value">{stats.users.members}</span>
            </div>
            <div className="stats-detail">
              <span className="detail-label">Admins:</span>
              <span className="detail-value">{stats.users.admins}</span>
            </div>
          </div>
        </div>
        <Link to="/admins" className="stats-action">View</Link>
      </div>
      
      {/* Gyms card removed */}
      
      <div className="stats-card">
        <div className="stats-icon equipment-icon">🏋️</div>
        <div className="stats-content">
          <h3 className="stats-title">Equipment</h3>
          <div className="stats-count">{stats.equipment.total}</div>
          <div className="stats-details">
            <div className="stats-detail">
              <span className="detail-label">Active:</span>
              <span className="detail-value">{stats.equipment.working}</span>
            </div>
            <div className="stats-detail">
              <span className="detail-label">Maintenance:</span>
              <span className="detail-value">{stats.equipment.damaged}</span>
            </div>
          </div>
        </div>
        <Link to="/equipment" className="stats-action">View</Link>
      </div>
      
      <div className="stats-card">
        <div className="stats-icon tickets-icon">🎫</div>
        <div className="stats-content">
          <h3 className="stats-title">Tickets</h3>
          <div className="stats-count">{stats.tickets.total}</div>
          <div className="stats-details">
            <div className="stats-detail">
              <span className="detail-label">Pending:</span>
              <span className="detail-value">{stats.tickets.pending}</span>
            </div>
            <div className="stats-detail">
              <span className="detail-label">Solved:</span>
              <span className="detail-value">{stats.tickets.solved}</span>
            </div>
          </div>
        </div>
        <Link to="/tickets" className="stats-action">View</Link>
      </div>
    </div>
  );
};

export default DashboardStats;