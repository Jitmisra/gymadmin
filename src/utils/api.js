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

const API_BASE_URL = 'http://localhost:7800/api/v1';

// Authentication
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.admin));
    
    return {
      user: data.admin,
      token: data.token
    };
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
      total: 2,
      members: 1,
      admins: 1
    },
    gyms: {
      total: 2
    },
    equipment: {
      total: 6,
      working: 6,
      damaged: 0
    },
    tickets: {
      total: 0,
      pending: 0,
      solved: 0
    }
  };
};

// Gym management
export const fetchGyms = async () => {
  try {
    // Use the real API endpoint to fetch gyms
    // For now, return mock data with the specified IDs
    return [
      { id: 1, name: 'Main Campus Gym', location: 'IIT Roorkee', members: 1, status: 'active', gymId: 2 },
      { id: 2, name: 'North Campus Gym', location: 'IIT Roorkee', members: 1, status: 'active', gymId: 3 }
    ];
  } catch (error) {
    console.error('Error fetching gyms:', error);
    throw error;
  }
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
    const allGyms = await fetchGyms();
    // For demo purposes, let's find a gym from our mock data
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
    { id: 1, name: 'Treadmill', gym: 'Main Campus Gym', gymId: 2, status: 'operational', lastMaintenance: '2023-05-10' },
    { id: 2, name: 'Bench Press', gym: 'Main Campus Gym', gymId: 2, status: 'operational', lastMaintenance: '2023-02-15' },
    { id: 3, name: 'Squat Rack', gym: 'Main Campus Gym', gymId: 2, status: 'operational', lastMaintenance: '2023-06-01' },
    { id: 4, name: 'Dumbbells Set', gym: 'North Campus Gym', gymId: 3, status: 'operational', lastMaintenance: '2023-04-20' },
    { id: 5, name: 'Exercise Bike', gym: 'North Campus Gym', gymId: 3, status: 'operational', lastMaintenance: '2023-03-15' },
    { id: 6, name: 'Smith Machine', gym: 'North Campus Gym', gymId: 3, status: 'operational', lastMaintenance: '2023-01-25' }
  ];
};

export const fetchEquipmentByGym = async (gymId) => {
  try {
    console.log(`Fetching equipment for gym ID: ${gymId}`);
    
    // Use the real API endpoint
    const url = `${API_BASE_URL}/admin/machines/all?gymId=${gymId}`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching equipment:', errorText);
      throw new Error(`Failed to fetch equipment: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Equipment fetched successfully:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch equipment');
    }
    
    // Transform the API response to match the expected format
    return Array.isArray(data.data) ? data.data.map(machine => ({
      id: machine.id,
      name: machine.name,
      description: machine.description,
      status: machine.status,
      gymId: machine.gymId,
      gym: machine.gymName || 'Unknown Gym', // Use gymName if available
      lastMaintenance: machine.updatedAt ? new Date(machine.updatedAt).toISOString().split('T')[0] : null,
      photoUrl: machine.imageUrl,
      No_Of_Uses: machine.No_Of_Uses,
      needService: machine.needService
    })) : [];
    
  } catch (error) {
    console.error('Error in fetchEquipmentByGym:', error);
    
    // Fallback to the mock data filtering method in case of an API error
    try {
      console.log('Falling back to mock data for equipment');
      const allEquipment = await fetchEquipment();
      
      // Filter equipment by gymId
      const equipmentWithPhotos = allEquipment
        .filter(item => item.gymId === parseInt(gymId))
        .map(item => ({
          ...item,
          photoUrl: `https://source.unsplash.com/random/150x150?${item.name.toLowerCase().replace(/\s+/g, '-')}`
        }));
      
      return equipmentWithPhotos;
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
      throw error; // Throw the original error
    }
  }
};

export const createEquipment = async (equipmentData, photo) => {
  try {
    // Format data for the API
    const payload = {
      name: equipmentData.name,
      description: equipmentData.description || 'No description provided',
      imageUrl: photo ? URL.createObjectURL(photo) : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', // Default image if none provided
      No_Of_Uses: 0, // New equipment starts with 0 uses
      gymId: equipmentData.gymId,
      status: equipmentData.status || 'active'
    };
    
    console.log('Creating equipment with payload:', payload);
    
    // Call the real API endpoint
    const response = await fetch(`${API_BASE_URL}/admin/machines/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Equipment creation response:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create equipment');
    }
    
    // Return the created equipment data
    return {
      id: data.data.id,
      name: data.data.name,
      description: data.data.description,
      status: data.data.status,
      lastMaintenance: new Date().toISOString().split('T')[0],
      photoUrl: data.data.imageUrl,
      gymId: data.data.gymId,
      gym: equipmentData.gym, // Keep the gym name if available
      No_Of_Uses: data.data.No_Of_Uses,
      needService: data.data.needService
    };
  } catch (error) {
    console.error('Error creating equipment:', error);
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

export const updateEquipmentStatus = async (equipmentId, newStatus) => {
  try {
    console.log(`Updating equipment ${equipmentId} status to ${newStatus}`);
    
    // Use PUT instead of PATCH to avoid CORS issues
    const response = await fetch(`${API_BASE_URL}/admin/machines/status/${equipmentId}`, {
      method: 'PUT', // Changed from PATCH to PUT
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Status update response:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update equipment status');
    }
    
    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error updating equipment status:', error);
    throw error;
  }
};

// Ticket management
export const fetchTickets = async () => {
  try {
    // Use the real API endpoint to fetch tickets
    const response = await fetch(`${API_BASE_URL}/admin/tickets/user/534839`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching tickets:', errorText);
      throw new Error(`Failed to fetch tickets: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Tickets fetched successfully:', data);
    
    if (!data.success || !Array.isArray(data.tickets)) {
      throw new Error('Invalid response format from server');
    }
    
    // Transform the API response to match the expected format
    return data.tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      issuerEmail: ticket.userId, // Using userId as issuerEmail for now
      gym: "Unknown", // API doesn't provide gym info
      status: ticket.status,
      date: new Date(ticket.createdAt).toISOString().split('T')[0],
      priority: ticket.ticketType === 'user' ? 'medium' : 'high' // Assign priority based on ticket type
    }));
  } catch (error) {
    console.error('Error in fetchTickets:', error);
    // Return mock data as fallback in case of error
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
  }
};

export const fetchTicketsByGym = async (gymId) => {
  try {
    // At the moment, API doesn't support filtering by gym
    // So we'll fetch all tickets and filter client-side
    const allTickets = await fetchTickets();
    const gym = await fetchGymById(gymId);
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    // Since we don't have gym info in API, we'll return all tickets
    // In a real implementation, you'd filter by gym when the API supports it
    return allTickets;
  } catch (error) {
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    // Only include the exact fields needed by API
    const payload = {
      userId: "534839", // Use the hardcoded ID that works
      title: ticketData.title,
      description: ticketData.description,
      ticketType: "user"
    };
    
    console.log('Sending ticket payload:', payload); // For debugging
    
    // Make API call to the real endpoint
    const response = await fetch(`${API_BASE_URL}/admin/tickets/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      // Log the error response for debugging
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to create ticket: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Ticket creation successful:', data);
    
    // Return the ticket data from the response
    return {
      id: data.ticket.id,
      title: data.ticket.title,
      description: data.ticket.description,
      status: data.ticket.status || 'open',
      date: new Date(data.ticket.createdAt).toISOString().split('T')[0],
      gym: ticketData.gym || "Unknown", // Keep gym info if provided
      issuerEmail: ticketData.issuerEmail,
      priority: ticketData.priority || 'medium'
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    // Use the real API endpoint to delete a ticket
    const response = await fetch(`${API_BASE_URL}/admin/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error deleting ticket ${ticketId}:`, errorText);
      throw new Error(`Failed to delete ticket: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully deleted ticket ${ticketId}:`, data);
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting ticket ${ticketId}:`, error);
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
    
    // For demo purposes, return a default member
    const gym = await fetchGymById(gymId);
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    // Return Agnik as a default member for each gym
    return [
      {
        id: `${gymId}-1`,
        name: 'Agnik',
        email: 'agnikm@gmail.com',
        joinDate: '2023-01-15',
        status: 'active',
        gymId: parseInt(gymId)
      }
    ];
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
    // Try both potential endpoints with the correct one first
    const urls = [
      `${API_BASE_URL}/admin/admin/all`,  // Updated to the correct endpoint
      `${API_BASE_URL}/admin/auth/admin`
    ];
    
    let response;
    let data;
    let error;
    
    // Try the first URL
    try {
      response = await fetch(urls[0], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Check if response is JSON by examining Content-Type header
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }
      
      data = await response.json();
    } catch (err) {
      // If first URL fails, try the second one
      console.log('First admin endpoint failed, trying alternative...');
      error = err;
      
      try {
        response = await fetch(urls[1], {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server');
        }
        
        data = await response.json();
        error = null; // Clear error if second attempt succeeds
      } catch (secondErr) {
        console.error('Both admin endpoints failed:', secondErr);
        // If both fail, fall back to mock data
        console.log('Falling back to mock admin data');
        return getMockAdmins();
      }
    }
    
    if (error) throw error;
    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }
    
    console.log('Admin data response:', data);
    
    // Check if data has expected structure
    const adminList = data.admin || data.admins || data || [];
    
    // Format the response to match what the frontend expects
    return Array.isArray(adminList) ? adminList.map(admin => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'Admin',
      lastLogin: admin.updatedAt ? new Date(admin.updatedAt).toISOString().split('T')[0] : null
    })) : [];
  } catch (error) {
    console.error('Error fetching administrators:', error);
    // Fall back to mock data in case of any error
    return getMockAdmins();
  }
};

// Helper function to provide mock admin data as fallback
function getMockAdmins() {
  return [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@gym.com',
      role: 'Admin',
      lastLogin: new Date().toISOString().split('T')[0]
    },
    {
      id: 2,
      name: 'Agnik',
      email: 'agnik@gmail.com',
      role: 'Admin',
      lastLogin: new Date().toISOString().split('T')[0]
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@gym.com',
      role: 'Admin',
      lastLogin: new Date().toISOString().split('T')[0]
    }
  ];
}

export const createAdmin = async (adminData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name: adminData.name,
        email: adminData.email,
        password: adminData.password
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create admin');
    }
    
    // Return the new admin from the response
    return {
      id: data.newadmin.id,
      name: data.newadmin.name,
      email: data.newadmin.email,
      role: 'Admin',
      lastLogin: null
    };
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/admin/delete/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete administrator');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting administrator:', error);
    throw error;
  }
};

export const resetAdminPassword = async (adminId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/admin/update/${adminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      // No need to send a new password - assuming the API generates one
      body: JSON.stringify({
        resetPassword: true
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset administrator password');
    }
    
    return {
      success: true,
      message: data.message || 'Password has been reset successfully.'
    };
  } catch (error) {
    console.error('Error resetting administrator password:', error);
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
    
    // Return stats based on our predefined data
    return {
      users: {
        total: 2,  // 1 member + 1 admin
        members: 1,
        admins: 1
      },
      equipment: {
        total: 3,  // 3 equipment per gym
        working: 3,
        damaged: 0
      },
      tickets: {
        total: 0,
        pending: 0,
        solved: 0
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