import React, { useState } from 'react';
import './CommunityControls.css';

const CommunityControls = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="community-controls">
      <div className="filters-section">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All Posts
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'announcements' ? 'active' : ''}`}
          onClick={() => handleFilterChange('announcements')}
        >
          Announcements
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'events' ? 'active' : ''}`}
          onClick={() => handleFilterChange('events')}
        >
          Events
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'tips' ? 'active' : ''}`}
          onClick={() => handleFilterChange('tips')}
        >
          Fitness Tips
        </button>
      </div>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default CommunityControls;