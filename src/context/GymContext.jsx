import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchGyms } from '../utils/api';

// Create context with a default value
export const GymContext = createContext(null);

// Named export for the provider component (better for Fast Refresh)
export function GymProvider({ children }) {
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all gyms on component mount
  useEffect(() => {
    const loadGyms = async () => {
      try {
        setLoading(true);
        const gymsData = await fetchGyms();
        setGyms(gymsData);
        
        // Check if we have a previously selected gym in localStorage
        const savedGymId = localStorage.getItem('selectedGym');
        if (savedGymId) {
          const gym = gymsData.find(g => g.id.toString() === savedGymId);
          if (gym) {
            setSelectedGym(gym);
          }
        }
      } catch (err) {
        setError('Failed to load gyms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGyms();
  }, []);

  // Function to select a gym
  const selectGym = (gym) => {
    setSelectedGym(gym);
    localStorage.setItem('selectedGym', gym.id.toString());
  };

  // Function to clear the selected gym
  const clearSelectedGym = () => {
    setSelectedGym(null);
    localStorage.removeItem('selectedGym');
  };

  // Function to add a newly created gym to the list
  const addGym = (newGym) => {
    setGyms(prevGyms => [...prevGyms, newGym]);
    selectGym(newGym);
  };

  // The context value that will be provided
  const value = {
    gyms,
    selectedGym,
    loading,
    error,
    selectGym,
    clearSelectedGym,
    addGym,
    hasSelectedGym: !!selectedGym
  };

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

// Custom hook
export function useGym() {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
}

// No default export to avoid Fast Refresh issues
