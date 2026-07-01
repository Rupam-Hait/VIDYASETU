export const API_BASE = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? 'https://vidyasetu-6dqs.onrender.com'
  : '';
