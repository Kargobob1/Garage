const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      return { success: false };
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('username', data.username);
    return { success: true, role: data.role };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
};

export const isAuthenticated = () => !!localStorage.getItem('token');
export const getUserRole = () => localStorage.getItem('userRole');
export const getUsername = () => localStorage.getItem('username');