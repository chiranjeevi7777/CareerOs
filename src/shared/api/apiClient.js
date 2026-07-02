/**
 * Typed API client for all backend communication.
 *
 * Usage:
 *   import { apiClient } from '../../shared/api/apiClient';
 *   const data = await apiClient.post('/api/analytics-insights', payload);
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const request = async (method, endpoint, body) => {
  const init = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, init);

  if (!response.ok) {
    throw new ApiError(response.status, `${method} ${endpoint} → ${response.status}`);
  }

  return response.json();
};

export const apiClient = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, body) => request('POST', endpoint, body),
};

export { ApiError };
