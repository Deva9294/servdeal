// Utility helper functions for KritiX

// Format duration from seconds to readable format
export const formatDuration = (seconds) => {
  if (!seconds) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

// Format views/likes in human readable format
export const formatNumber = (num) => {
  if (!num) return '0';

  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Format date to readable format
export const formatDate = (date) => {
  if (!date) return '';

  const d = new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

// Calculate engagement rate
export const calculateEngagementRate = (likes, comments, views) => {
  if (!views || views === 0) return 0;

  const engagement = ((likes + comments) / views) * 100;
  return Math.round(engagement * 100) / 100;
};

// Get time ago from date
export const getTimeAgo = (date) => {
  if (!date) return '';

  const now = new Date();
  const diff = now - new Date(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

// Generate random ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Check if email is valid
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if URL is valid
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Truncate text
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};

// Convert object to query string
export const objectToQuery = (obj) => {
  return Object.keys(obj)
    .filter(key => obj[key] !== null && obj[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

// Delay function for async operations
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function for failed requests
export const retry = async (fn, retries = 3, delay_ms = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(delay_ms * (i + 1));
    }
  }
};

// Parse query string to object
export const parseQuery = (queryString) => {
  const query = {};
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');

  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    query[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });

  return query;
};

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Get dominant color from image URL
export const getDominantColor = async (imageUrl) => {
  // Placeholder implementation
  return '#000000';
};

export default {
  formatDuration,
  formatNumber,
  formatDate,
  calculateEngagementRate,
  getTimeAgo,
  generateId,
  isValidEmail,
  isValidURL,
  truncateText,
  objectToQuery,
  delay,
  retry,
  parseQuery,
  generateSlug,
  calculatePercentage,
  getDominantColor,
};
