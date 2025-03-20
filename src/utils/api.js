import axios from 'axios';

const API_URL = 'https://api.yourgymapp.com'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const login = async (email, password) => {
  try {
    // For demo purposes, we'll use a mock response
    // In a real app, you would use: const response = await api.post('/auth/login', { email, password });
    
    // Mock successful login
    if ((email === 'admin@gym.com' && password === 'admin123') || 
        (email === 'agnik@gmail.com' && password === '12345678')) {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            name: email === 'agnik@gmail.com' ? 'Agnik' : 'Admin User',
            email: email,
            role: 'Admin' // Changed from admin to Admin for consistency
          }
        }
      };
      localStorage.setItem('token', mockResponse.data.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
      return mockResponse.data;
    }
    
    throw new Error('Invalid credentials');
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Dashboard statistics
export const fetchDashboardStats = async () => {
  // In a real app: return api.get('/dashboard/stats');
  return {
    users: {
      total: 1250,
      members: 1235,
      admins: 15
    },
    gyms: {
      total: 15
    },
    equipment: {
      total: 320,
      working: 298,
      damaged: 22
    },
    tickets: {
      total: 45,
      pending: 8,
      solved: 37
    }
  };
};

// Gym management
export const fetchGyms = async () => {
  // In a real app: return api.get('/gyms');
  return [
    { id: 1, name: 'Fitness Plus', location: 'New York', members: 350, status: 'active' },
    { id: 2, name: 'Iron Works', location: 'Los Angeles', members: 275, status: 'active' },
    { id: 3, name: 'Muscle Factory', location: 'Chicago', members: 180, status: 'active' },
    { id: 4, name: 'Elite Fitness', location: 'Miami', members: 445, status: 'active' }
  ];
};

export const createGym = async (gymData) => {
  try {
    // In a real app, this would be an API call to create a gym
    // const response = await api.post('/gyms', gymData);
    
    // For demo purposes, we'll return a mock response with a generated ID
    const newGym = {
      id: Math.floor(Math.random() * 1000) + 10,
      ...gymData,
      members: 0
    };
    
    return newGym;
  } catch (error) {
    throw error;
  }
};

export const updateGym = async (gymId, gymData) => {
  try {
    // In a real app, this would be an API call to update a gym
    // const response = await api.put(`/gyms/${gymId}`, gymData);
    
    // For demo purposes, we'll return the updated gym data
    return {
      id: gymId,
      ...gymData
    };
  } catch (error) {
    throw error;
  }
};

export const fetchGymById = async (gymId) => {
  try {
    // In a real app, this would be an API call to get a gym by ID
    // const response = await api.get(`/gyms/${gymId}`);
    
    // For demo purposes, let's find a gym from our mock data
    const allGyms = await fetchGyms();
    const gym = allGyms.find(g => g.id.toString() === gymId.toString());
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    return gym;
  } catch (error) {
    throw error;
  }
};

export const deleteGym = async (gymId) => {
  try {
    // In a real app, this would be an API call to delete a gym
    // await api.delete(`/gyms/${gymId}`);
    
    // For demo purposes, we'll just return a success response
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Equipment management
export const fetchEquipment = async () => {
  // In a real app: return api.get('/equipment');
  return [
    { id: 1, name: 'Treadmill', gym: 'Fitness Plus', status: 'operational', lastMaintenance: '2023-05-10' },
    { id: 2, name: 'Bench Press', gym: 'Iron Works', status: 'needs maintenance', lastMaintenance: '2023-02-15' },
    { id: 3, name: 'Dumbbells Set', gym: 'Muscle Factory', status: 'operational', lastMaintenance: '2023-06-01' },
    { id: 4, name: 'Elliptical Machine', gym: 'Elite Fitness', status: 'operational', lastMaintenance: '2023-04-20' }
  ];
};

export const fetchEquipmentByGym = async (gymId) => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get(`/gyms/${gymId}/equipment`);
    
    // For demo purposes, get all equipment and filter
    const allEquipment = await fetchEquipment();
    const gym = await fetchGymById(gymId);
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    // Filter equipment by gym name and add mock photos
    const equipmentWithPhotos = allEquipment
      .filter(item => item.gym === gym.name)
      .map(item => ({
        ...item,
        photoUrl: `https://source.unsplash.com/random/150x150?${item.name.toLowerCase().replace(/\s+/g, '-')}`
      }));
    
    return equipmentWithPhotos;
  } catch (error) {
    throw error;
  }
};

export const createEquipment = async (equipmentData, photo) => {
  try {
    // In a real app, this would be an API call with file upload
    // const formData = new FormData();
    // Object.keys(equipmentData).forEach(key => formData.append(key, equipmentData[key]));
    // if (photo) formData.append('photo', photo);
    // const response = await api.post('/equipment', formData);
    
    // For demo purposes, return a mock response
    return {
      id: Math.floor(Math.random() * 1000) + 1,
      ...equipmentData,
      photoUrl: photo ? URL.createObjectURL(photo) : null
    };
  } catch (error) {
    throw error;
  }
};

export const updateEquipment = async (equipmentId, equipmentData, photo) => {
  try {
    // In a real app, this would be an API call with possible file upload
    // Similar to createEquipment but with PUT request
    
    // For demo purposes, return updated data
    return {
      id: equipmentId,
      ...equipmentData,
      photoUrl: photo ? URL.createObjectURL(photo) : equipmentData.photoUrl
    };
  } catch (error) {
    throw error;
  }
};

export const deleteEquipment = async (equipmentId) => {
  try {
    // In a real app: await api.delete(`/equipment/${equipmentId}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Ticket management
export const fetchTickets = async () => {
  // In a real app: return api.get('/tickets');
  return [
    { 
      id: 1, 
      title: 'Broken treadmill',
      description: 'Treadmill #3 is making a loud noise and stops unexpectedly',
      issuerEmail: 'john.doe@example.com',
      gym: 'Fitness Plus', 
      status: 'open', 
      date: '2023-07-15', 
      priority: 'high' 
    },
    { 
      id: 2, 
      title: 'AC not working',
      description: 'The air conditioning in the cardio section is not cooling properly',
      issuerEmail: 'manager@ironworks.com',
      gym: 'Iron Works', 
      status: 'in progress', 
      date: '2023-07-12', 
      priority: 'medium' 
    },
    { 
      id: 3, 
      title: 'Water dispenser leaking',
      description: 'The water dispenser near the free weights area is leaking and creating a puddle',
      issuerEmail: 'staff@elitefitness.com', 
      gym: 'Elite Fitness', 
      status: 'open', 
      date: '2023-07-10', 
      priority: 'low' 
    },
    { 
      id: 4, 
      title: 'Locker room needs cleaning',
      description: 'The men\'s locker room needs urgent cleaning and attention',
      issuerEmail: 'member@fitness.com',
      gym: 'Fitness Plus', 
      status: 'closed', 
      date: '2023-07-05', 
      priority: 'medium' 
    }
  ];
};

export const fetchTicketsByGym = async (gymId) => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get(`/gyms/${gymId}/tickets`);
    
    // For demo purposes, get all tickets and filter
    const allTickets = await fetchTickets();
    const gym = await fetchGymById(gymId);
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    // Filter tickets by gym name
    return allTickets.filter(ticket => ticket.gym === gym.name);
  } catch (error) {
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    // In a real app, this would be an API call to create a ticket
    // const response = await api.post('/tickets', ticketData);
    
    // For demo purposes, we'll return a mock response with a generated ID
    const gym = await fetchGymById(ticketData.gymId);
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    const newTicket = {
      id: Math.floor(Math.random() * 1000) + 10, // Generate random ID
      ...ticketData,
      gym: gym.name,
      priority: 'medium', // Default priority
    };
    
    console.log('New ticket created:', newTicket);
    
    return newTicket;
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    // In a real app, this would be an API call to delete a ticket
    // await api.delete(`/tickets/${ticketId}`);
    
    // For demo purposes, we'll just return a success response
    console.log(`Deleting ticket with ID: ${ticketId}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const updateTicketStatus = async (ticketId, newStatus) => {
  try {
    // In a real app: return api.patch(`/tickets/${ticketId}`, { status: newStatus });
    
    // For demo purposes, just return success
    console.log(`Updated ticket ${ticketId} status to ${newStatus}`);
    return { success: true, message: 'Ticket status updated' };
  } catch (error) {
    throw error;
  }
};

// Member management
export const fetchMembersByGym = async (gymId) => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get(`/gyms/${gymId}/members`);
    
    // For demo purposes, generate mock members
    const gym = await fetchGymById(gymId);
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    // Generate a consistent set of members based on gym ID
    const memberCount = gym.members;
    const members = [];
    
    for (let i = 1; i <= Math.min(memberCount, 50); i++) {
      members.push({
        id: `${gymId}-${i}`,
        name: `Member ${i}`,
        email: `member${i}@example.com`,
        joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().slice(0, 10),
        status: Math.random() > 0.1 ? 'active' : 'inactive',
        gymId: gymId
      });
    }
    
    return members;
  } catch (error) {
    throw error;
  }
};

export const createMember = async (memberData) => {
  try {
    // In a real app, this would be an API call to create a member
    // const response = await api.post('/members', memberData);
    
    // For demo purposes, we'll return a mock response with a generated ID
    const newMember = {
      id: Math.floor(Math.random() * 1000) + 10,
      ...memberData,
      joinDate: new Date().toISOString().slice(0, 10),
      membershipType: 'Standard'
    };
    
    return newMember;
  } catch (error) {
    throw error;
  }
};

export const deleteMember = async (memberId) => {
  try {
    // In a real app, this would be an API call to delete a member
    // await api.delete(`/members/${memberId}`);
    
    // For demo purposes, we'll just return a success response
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const resetMemberPassword = async (memberId) => {
  try {
    // In a real app, this would be an API call to reset a member's password
    // const response = await api.post(`/members/${memberId}/reset-password`);
    
    // For demo purposes, we'll return a mock response
    return {
      success: true,
      message: 'Password has been reset successfully and sent to the member\'s email.'
    };
  } catch (error) {
    throw error;
  }
};

// Admin management
export const fetchAdmins = async () => {
  try {
    // In a real app, this would fetch administrators from an API
    // const response = await api.get('/admins');
    
    // For demo purposes, return mock data
    return [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@gym.com',
        role: 'Admin', // Changed from SuperAdmin to Admin
        lastLogin: '2023-07-15'
      },
      {
        id: 2,
        name: 'Agnik',
        email: 'agnik@gmail.com',
        role: 'Admin',
        lastLogin: '2023-07-14'
      },
      {
        id: 3,
        name: 'Jane Smith',
        email: 'jane@gym.com',
        role: 'Admin',
        lastLogin: '2023-07-10'
      },
      {
        id: 4,
        name: 'Michael Johnson',
        email: 'michael@gym.com',
        role: 'Admin',
        lastLogin: '2023-07-08'
      }
    ];
  } catch (error) {
    throw error;
  }
};

export const createAdmin = async (adminData) => {
  try {
    // In a real app, this would be an API call to create an admin
    // const response = await api.post('/admins', adminData);
    
    // For demo purposes, we'll return a mock response with a generated ID
    const newAdmin = {
      id: Math.floor(Math.random() * 1000) + 10,
      ...adminData,
      role: 'Admin', // Ensure all created admins have the Admin role
      lastLogin: null
    };
    
    return newAdmin;
  } catch (error) {
    throw error;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    // In a real app, this would be an API call to delete an admin
    // await api.delete(`/admins/${adminId}`);
    
    // For demo purposes, we'll just return a success response
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const resetAdminPassword = async (adminId) => {
  try {
    // In a real app, this would be an API call to reset an admin's password
    // const response = await api.post(`/admins/${adminId}/reset-password`);
    
    // For demo purposes, we'll return a mock response
    return {
      success: true,
      message: 'Password has been reset successfully and sent to the admin\'s email.'
    };
  } catch (error) {
    throw error;
  }
};

// Gym dashboard stats
export const fetchGymDashboardStats = async (gymId) => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get(`/gyms/${gymId}/dashboard`);
    
    // For demo purposes, generate stats based on gym ID
    const gym = await fetchGymById(gymId);
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    // Random but consistent values based on gym ID
    const memberCount = gym.members;
    const adminCount = Math.max(1, Math.floor(memberCount / 100));
    
    return {
      users: {
        total: memberCount + adminCount,
        members: memberCount,
        admins: adminCount
      },
      equipment: {
        total: Math.floor(memberCount / 4),
        working: Math.floor((memberCount / 4) * 0.9),
        damaged: Math.floor((memberCount / 4) * 0.1)
      },
      tickets: {
        total: Math.floor(memberCount / 30),
        pending: Math.floor((memberCount / 30) * 0.2),
        solved: Math.floor((memberCount / 30) * 0.8)
      }
    };
  } catch (error) {
    throw error;
  }
};

// Community management
export const fetchCommunityPosts = async () => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get('/community/posts');
    
    // Mock data for demonstration
    return [
      {
        id: 1,
        author: 'Sarah Johnson',
        role: 'Gym Manager',
        gym: 'Fitness Plus',
        title: 'New workout classes starting next week',
        content: 'We are excited to announce new workout classes starting next week including HIIT, Yoga, and Spin. Check the schedule for more details!',
        likes: 24,
        comments: 8,
        date: '2023-07-15'
      },
      {
        id: 2,
        author: 'Mike Wilson',
        role: 'Personal Trainer',
        gym: 'Iron Works',
        title: 'Nutrition tips for better workout results',
        content: 'Want to maximize your workout results? Here are some nutrition tips that can help you achieve your fitness goals faster...',
        likes: 42,
        comments: 15,
        date: '2023-07-10'
      },
      {
        id: 3,
        author: 'Admin',
        role: 'System Administrator',
        gym: 'All Gyms',
        title: 'System maintenance this weekend',
        content: 'We will be performing system maintenance this weekend. The admin panel will be unavailable from Saturday 10 PM to Sunday 2 AM.',
        likes: 5,
        comments: 2,
        date: '2023-07-08'
      }
    ];
  } catch (error) {
    throw error;
  }
};

export const deleteCommunityPost = async (postId) => {
  try {
    // In a real app, this would be an API call to delete a post
    // await api.delete(`/community/posts/${postId}`);
    
    console.log(`Deleting community post with ID: ${postId}`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export default api;