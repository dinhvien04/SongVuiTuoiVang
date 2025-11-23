const API_URL = 'http://localhost:5000/api';

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    token: string;
  };
  message?: string;
}

export interface Activity {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  participants: string;
  category: string;
  format: 'online' | 'offline';
  package: 'vip' | 'standard';
  price: number;
  priceUnit: string;
  location?: string;
  instructor?: string;
  features: string[];
}

export interface ActivitiesResponse {
  success: boolean;
  count?: number;
  data?: Activity[] | Activity; // Can be array or single object
  message?: string;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getMe: async (token: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

export const activityAPI = {
  getAll: async (params?: {
    category?: string;
    format?: string;
    search?: string;
  }): Promise<ActivitiesResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.format) queryParams.append('format', params.format);
      if (params?.search) queryParams.append('search', params.search);

      const response = await fetch(
        `${API_URL}/activities?${queryParams.toString()}`
      );
      
      if (!response.ok) {
        return { success: false, message: 'Failed to fetch activities' };
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching activities:', error);
      return { success: false, message: 'Network error' };
    }
  },

  getById: async (id: string): Promise<ActivitiesResponse> => {
    try {
      const response = await fetch(`${API_URL}/activities/${id}`);
      
      if (!response.ok) {
        return { success: false, message: 'Activity not found' };
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching activity:', error);
      return { success: false, message: 'Network error' };
    }
  },

  create: async (data: Partial<Activity>): Promise<ActivitiesResponse> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        return { success: false, message: 'Failed to create activity' };
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating activity:', error);
      return { success: false, message: 'Network error' };
    }
  },
};
