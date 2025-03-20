import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GymProvider } from './context/GymContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import GymRoute from './components/Auth/GymRoute';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import GymSelectionPage from './pages/GymSelectionPage';
import DashboardPage from './pages/DashboardPage';
import GymsPage from './pages/GymsPage';
import AddGymPage from './pages/AddGymPage';
import EditGymPage from './pages/EditGymPage';
import TicketsPage from './pages/TicketsPage';
import EquipmentPage from './pages/EquipmentPage';
import CommunityPage from './pages/CommunityPage';
import MembersPage from './pages/MembersPage';
import AdminsPage from './pages/AdminsPage';
import AddMemberPage from './pages/AddMemberPage';
import AddAdminPage from './pages/AddAdminPage';
import AddEquipmentPage from './pages/AddEquipmentPage';
import EditEquipmentPage from './pages/EditEquipmentPage';
import AddTicketPage from './pages/AddTicketPage';
import './assets/styles/main.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <GymProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes (requires authentication) */}
            <Route element={<ProtectedRoute />}>
              {/* Gym selection route */}
              <Route path="/select-gym" element={<GymSelectionPage />} />
              <Route path="/gyms/new" element={<AddGymPage />} />
              
              {/* Routes that require gym selection */}
              <Route element={<GymRoute />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/gyms" element={<GymsPage />} />
                  <Route path="/gyms/:id/edit" element={<EditGymPage />} />
                  <Route path="/members" element={<MembersPage />} />
                  <Route path="/members/new" element={<AddMemberPage />} />
                  <Route path="/admins" element={<AdminsPage />} />
                  <Route path="/admins/new" element={<AddAdminPage />} />
                  <Route path="/tickets" element={<TicketsPage />} />
                  <Route path="/tickets/new" element={<AddTicketPage />} />
                  <Route path="/equipment" element={<EquipmentPage />} />
                  <Route path="/equipment/new" element={<AddEquipmentPage />} />
                  <Route path="/equipment/:id/edit" element={<EditEquipmentPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                </Route>
              </Route>
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/select-gym" replace />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </GymProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;