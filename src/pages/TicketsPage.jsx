import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTicketsByGym, deleteTicket, updateTicketStatus } from '../utils/api';
import { useGym } from '../context/GymContext';
import Button from '../components/UI/Button';
import './TicketsPage.css';

const TicketsPage = () => {
  const { selectedGym } = useGym();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);

  useEffect(() => {
    const loadTickets = async () => {
      if (!selectedGym) return;
      
      try {
        setLoading(true);
        const data = await fetchTicketsByGym(selectedGym.id);
        setTickets(data);
      } catch (err) {
        setError('Failed to load tickets data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [selectedGym]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (ticket.issuerEmail && ticket.issuerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleDeleteTicket = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        setIsDeleting(true);
        await deleteTicket(id);
        // Update the local state after successful deletion
        setTickets(tickets.filter(ticket => ticket.id !== id));
      } catch (err) {
        alert('Failed to delete ticket. Please try again.');
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingTicketId(id);
      await updateTicketStatus(id, newStatus);
      // Update the local state after successful status change
      setTickets(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (err) {
      alert('Failed to update ticket status. Please try again.');
      console.error(err);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  if (loading) {
    return <div className="tickets-loading">Loading tickets data...</div>;
  }

  if (error) {
    return <div className="tickets-error">{error}</div>;
  }

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <h1>{selectedGym.name} - Tickets</h1>
        <Link to="/tickets/new" className="create-ticket-btn">
          <span className="btn-icon">+</span> New Ticket
        </Link>
      </div>

      <div className="tickets-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <label htmlFor="status-filter">Status:</label>
          <select 
            id="status-filter" 
            value={filter} 
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {filteredTickets.length > 0 ? (
        <div className="tickets-list">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3 className="ticket-title">{ticket.title}</h3>
                <span className={`status-badge status-${ticket.status.replace(/\s+/g, '-')}`}>
                  {ticket.status}
                </span>
              </div>
              
              <div className="ticket-info">
                <div className="ticket-description">{ticket.description}</div>
                <div className="ticket-meta">
                  <div className="meta-item">
                    <span className="meta-label">ID:</span>
                    <span className="meta-value">{ticket.id}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">From:</span>
                    <span className="meta-value">{ticket.issuerEmail}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Date:</span>
                    <span className="meta-value">{ticket.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="ticket-actions">
                <div className="status-changer">
                  <label htmlFor={`status-${ticket.id}`}>Status:</label>
                  <select
                    id={`status-${ticket.id}`}
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    disabled={updatingTicketId === ticket.id}
                  >
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteTicket(ticket.id)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-tickets">
          <div className="no-tickets-message">
            {searchTerm || filter !== 'all'
              ? "No tickets found matching your criteria."
              : "No tickets found. Create your first ticket!"}
          </div>
          <Link to="/tickets/new" className="no-tickets-action">
            Create New Ticket
          </Link>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;