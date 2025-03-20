import React from 'react';
import { Link } from 'react-router-dom';
import EquipmentList from '../components/Equipment/EquipmentList';
import './EquipmentPage.css';

const EquipmentPage = () => {
  return (
    <div className="equipment-page">
      <div className="equipment-page-header">
        <h1>Equipment Management</h1>
        <Link to="/equipment/new" className="create-equipment-btn">Add New Equipment</Link>
      </div>
      
      <div className="equipment-page-content">
        <EquipmentList />
      </div>
    </div>
  );
};

export default EquipmentPage;