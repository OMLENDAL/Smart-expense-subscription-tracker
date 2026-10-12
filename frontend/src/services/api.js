// This file centralizes API requests for the frontend.
// It keeps the app easier to maintain and helps avoid repeated fetch logic.
// Keep API requests on the same host as the website. This works from localhost
// on the computer and from the computer's Wi-Fi address on a phone.
const API_BASE_URL = import.meta.env.VITE_API_URL
  || `${window.location.protocol}//${window.location.hostname}:5000/api`;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
