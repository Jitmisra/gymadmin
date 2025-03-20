import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardStats.css';

const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Users</h3>
        <div className="stat-value">{stats.users.total}</div>
        <div className="stat-breakdown">
          <div className="stat-subitem">
            <span className="stat-label">Members:</span>
            <span className="stat-subvalue">{stats.users.members}</span>
          </div>
          <div className="stat-subitem">
            <span className="stat-label">Admins:</span>
            <span className="stat-subvalue">{stats.users.admins}</span>
          </div>
        </div>
        <Link to="/users" className="stat-link">View all users</Link>
      </div>
      
      <div className="stat-card">
        <h3>Gyms</h3>
        <div className="stat-value">{stats.gyms.total}</div>
        <Link to="/gyms" className="stat-link">View all gyms</Link>
      </div>
      
      <div className="stat-card">
        <h3>Equipment</h3>
        <div className="stat-value">{stats.equipment.total}</div>
        <div className="stat-breakdown">
          <div className="stat-subitem">
            <span className="stat-label">Working:</span>
            <span className="stat-subvalue status-active">{stats.equipment.working}</span>
          </div>
          <div className="stat-subitem">
            <span className="stat-label">Damaged:</span>
            <span className="stat-subvalue status-inactive">{stats.equipment.damaged}</span>
          </div>
        </div>
        <Link to="/equipment" className="stat-link">View all equipment</Link>
      </div>
      
      <div className="stat-card">
        <h3>Tickets</h3>
        <div className="stat-value">{stats.tickets.total}</div>
        <div className="stat-breakdown">
          <div className="stat-subitem">
            <span className="stat-label">Pending:</span>
            <span className="stat-subvalue status-pending">{stats.tickets.pending}</span>
          </div>
          <div className="stat-subitem">
            <span className="stat-label">Solved:</span>
            <span className="stat-subvalue status-solved">{stats.tickets.solved}</span>
          </div>
        </div>
        <Link to="/tickets" className="stat-link">View all tickets</Link>
      </div>
    </div>
  );
};

export default DashboardStats;