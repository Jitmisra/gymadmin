import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGym } from '../../context/GymContext';

const GymRoute = () => {
  const { hasSelectedGym, loading } = useGym();
  
  if (loading) {
    return <div className="loading-screen">Loading gym data...</div>;
  }
  
  return hasSelectedGym ? <Outlet /> : <Navigate to="/select-gym" replace />;
};

export default GymRoute;
