// This file centralizes API requests for the frontend.
// It keeps the app easier to maintain and helps avoid repeated fetch logic.
//
// In development the Vite proxy (vite.config.js) forwards /api/* to the
// backend on port 5000, so all requests are same-origin and CORS is never
// an issue. VITE_API_URL can override the base URL for production deploys.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    // A TypeError here means the browser could not reach the API (network or CORS).
    throw new Error('Cannot connect to the server. Please make sure the backend is running.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
