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
  data?: Activity[];
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
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.format) queryParams.append('format', params.format);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(
      `${API_URL}/activities?${queryParams.toString()}`
    );
    return response.json();
  },

  getById: async (id: string): Promise<ActivitiesResponse> => {
    const response = await fetch(`${API_URL}/activities/${id}`);
    return response.json();
  },

  create: async (data: Partial<Activity>): Promise<ActivitiesResponse> => {
    const response = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
