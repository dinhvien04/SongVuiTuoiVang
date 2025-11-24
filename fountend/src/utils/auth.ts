// Auth utility functions

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    clearAuth();
    return null;
  }
};

export const getUser = (): any | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    clearAuth();
    return null;
  }
};

export const setAuth = (token: string, user: any) => {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting auth:', error);
    clearAuth();
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const checkAuth = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  if (isTokenExpired(token)) {
    clearAuth();
    return false;
  }
  
  return true;
};
