const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  };
  const response = await fetch(`${API_URL}${endpoint}`, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchGarages = () => apiRequest('/garages');
export const fetchGarageDetails = (garageId) => apiRequest(`/garages/${garageId}`);
export const createGarage = (garageData) => apiRequest('/garages', 'POST', garageData);
export const fetchPendingChanges = (garageId) => apiRequest(`/changes/pending/${garageId}`);
export const fetchAllPendingChanges = () => apiRequest('/changes/pending');
export const requestStatusChange = (spaceId, newStatus, effectiveDate) => 
  apiRequest('/changes', 'POST', { spaceId, newStatus, effectiveDate });
export const approveChange = (changeId) => apiRequest(`/changes/${changeId}/approve`, 'PUT');
export const rejectChange = (changeId) => apiRequest(`/changes/${changeId}/reject`, 'PUT');