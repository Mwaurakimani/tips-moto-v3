// Date utility functions for Tips Moto application

// Function to get today's date string in the same format as match dates
export const getTodayDateString = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

// Function to get yesterday's date string
export const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

// Function to get date strings for the past week (for test data)
export const getRecentDateStrings = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }));
  }
  return dates;
};

// Function to get future date strings (for upcoming matches)
export const getFutureDateStrings = () => {
  const dates = [];
  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }));
  }
  return dates;
};

// Helper function to create a Date object from date and time strings
export const createDateTime = (dateStr: string, timeStr: string): Date => {
  // Convert "Jan 01 2025" and "12:00 PM" to a Date object
  const dateTimeStr = `${dateStr} ${timeStr}`;
  return new Date(dateTimeStr);
};
