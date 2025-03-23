import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTickets } from '../../utils/api';
import './TicketList.css';

const TicketList = ({ limit }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const data = await fetchTickets();
        setTickets(limit ? data.slice(0, limit) : data);
      } catch (err) {
        setError('Failed to load tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [limit]);

  if (loading) {
    return <div className="ticket-list-loading">Loading tickets...</div>;
  }

  if (error) {
    return <div className="ticket-list-error">{error}</div>;
  }

  if (tickets.length === 0) {
    return <div className="no-tickets">No tickets found</div>;
  }

  return (
    <div className="ticket-list">
      {tickets.map(ticket => (
        <div key={ticket.id} className="ticket-item">
          <div className="ticket-title">{ticket.title}</div>
          <div className="ticket-gym">{ticket.gym || "Not assigned"}</div>
          <div className="ticket-date">{ticket.date}</div>
          <div className="ticket-status">
            <span className={`status-badge status-${ticket.status.replace(/\s+/g, '-')}`}>
              {ticket.status}
            </span>
          </div>
          <div className="ticket-priority">
            <span className={`priority-badge priority-${ticket.priority}`}>
              {ticket.priority}
            </span>
          </div>
          <div className="ticket-actions">
            <Link to={`/tickets/${ticket.id}`} className="ticket-action-btn view-btn">
              View
            </Link>
          </div>
        </div>
      ))}
      
      {limit && tickets.length >= limit && (
        <div className="view-all-container">
          <Link to="/tickets" className="view-all-link">View All Tickets</Link>
        </div>
      )}
    </div>
  );
};

export default TicketList;