import { format } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(new Date(date), formatStr);
};

export const getCategoryColor = (category) => {
  const colors = {
    groceries: 'bg-green-100 text-green-800',
    entertainment: 'bg-blue-100 text-blue-800',
    dining: 'bg-orange-100 text-orange-800',
    transportation: 'bg-purple-100 text-purple-800',
    utilities: 'bg-red-100 text-red-800',
    bills: 'bg-pink-100 text-pink-800',
    education: 'bg-indigo-100 text-indigo-800',
    'personal care': 'bg-rose-100 text-rose-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[category?.toLowerCase()] || colors.other;
};

export const getCategoryIcon = (category) => {
  const icons = {
    groceries: '🛒',
    entertainment: '🎬',
    dining: '🍽️',
    transportation: '🚗',
    utilities: '💡',
    bills: '📄',
    education: '📚',
    'personal care': '💄',
    other: '📌',
  };
  return icons[category?.toLowerCase()] || '📌';
};
