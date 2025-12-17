import { Habit } from './types';

// Robust date key generation (YYYY-MM-DD) based on local time
export const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const MOCK_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Stretch',
    description: '15 minutes of yoga or light stretching.',
    streak: 3,
    color: 'bg-green-500',
    emoji: '🧘',
    reminderTime: '07:00'
  },
  {
    id: '2',
    name: 'Code for 1 hour',
    description: 'Work on personal projects.',
    streak: 12,
    color: 'bg-blue-500',
    emoji: '💻',
    reminderTime: '20:00'
  },
  {
    id: '3',
    name: 'Drink 2L Water',
    description: 'Stay hydrated throughout the day.',
    streak: 5,
    color: 'bg-cyan-400',
    emoji: '💧'
  },
  {
    id: '4',
    name: 'Read 10 pages',
    description: 'Read a non-fiction book.',
    streak: 0,
    color: 'bg-purple-500',
    emoji: '📚',
    reminderTime: '22:00'
  }
];

// Helper to generate some fake history for the heatmap
export const generateMockHistory = (): Record<string, string[]> => {
  const history: Record<string, string[]> = {};
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateKey(d);
    
    // Randomly assign completions
    const completions = [];
    if (Math.random() > 0.3) completions.push('1');
    if (Math.random() > 0.5) completions.push('2');
    if (Math.random() > 0.6) completions.push('3');
    if (Math.random() > 0.8) completions.push('4');
    
    history[dateStr] = completions;
  }
  return history;
};