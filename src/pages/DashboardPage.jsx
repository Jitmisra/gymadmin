import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats, fetchGyms, fetchTickets, fetchEquipment } from '../utils/api';
import { useGym } from '../context/GymContext';
import DashboardStats from '../components/Dashboard/DashboardStats';
import './DashboardPage.css';

const DashboardPage = () => {
  const { selectedGym } = useGym();
  const [stats, setStats] = useState({
    users: {
      total: 0,
      members: 0,
      admins: 0
    },
    gyms: {
      total: 0
    },
    equipment: {
      total: 0,
      working: 0,
      damaged: 0
    },
    tickets: {
      total: 0,
      pending: 0,
      solved: 0
    }
  });
  const [recentGyms, setRecentGyms] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard summary stats
        const dashboardStats = await fetchDashboardStats();
        setStats(dashboardStats);

        // Fetch recent tickets - filter by selected gym if applicable
        const ticketsData = await fetchTickets();
        const filteredTickets = selectedGym 
          ? ticketsData.filter(ticket => ticket.gym === selectedGym.name)
          : ticketsData;
        setRecentTickets(filteredTickets.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGym]);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        {selectedGym && (
          <div className="current-gym-info">
            <div className="gym-badge">
              <span className={`status-indicator status-${selectedGym.status}`}></span>
              <span className="gym-status-text">{selectedGym.status}</span>
            </div>
            <div className="gym-members-count">
              <span className="members-icon">👥</span>
              <span>{selectedGym.members} members</span>
            </div>
          </div>
        )}
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Recent Activities Section */}
      <div className="dashboard-recent">
        <div className="recent-section">
          <h2 className="section-title">Recent Tickets</h2>
          <div className="recent-list">
            {recentTickets.length > 0 ? (
              recentTickets.map(ticket => (
                <div key={ticket.id} className="recent-item ticket">
                  <h3>{ticket.title}</h3>
                  <p>Date: {ticket.date}</p>
                  <p className="status">Status: <span className={`priority-${ticket.priority}`}>{ticket.status}</span></p>
                </div>
              ))
            ) : (
              <p>No tickets available for this gym</p>
            )}
            <Link to="/tickets" className="view-all-link">View All Tickets</Link>
          </div>
        </div>

        <div className="recent-section">
          <h2 className="section-title">Activity Feed</h2>
          <div className="recent-list">
            {selectedGym && (
              <>
                <div className="activity-item">
                  <span className="activity-icon">🔧</span>
                  <div className="activity-content">
                    <p className="activity-text"><strong>Maintenance</strong> scheduled for treadmill #3</p>
                    <p className="activity-time">2 hours ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">👤</span>
                  <div className="activity-content">
                    <p className="activity-text"><strong>New member</strong> joined: Sarah Johnson</p>
                    <p className="activity-time">Yesterday</p>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">💰</span>
                  <div className="activity-content">
                    <p className="activity-text"><strong>Payment received</strong> for July membership fees</p>
                    <p className="activity-time">2 days ago</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/tickets/new" className="action-button">
            <span className="action-icon">🎫</span>
            <span className="action-text">Create Ticket</span>
          </Link>
          <Link to="/members/new" className="action-button">
            <span className="action-icon">👥</span>
            <span className="action-text">Add Member</span>
          </Link>
          <Link to="/equipment/new" className="action-button">
            <span className="action-icon">🏋️</span>
            <span className="action-text">Add Equipment</span>
          </Link>
          <Link to="/community/post/new" className="action-button">
            <span className="action-icon">📢</span>
            <span className="action-text">Create Announcement</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;