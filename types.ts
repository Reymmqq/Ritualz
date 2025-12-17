export interface Habit {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  streak: number;
  color: string; // Tailwind color class helper or hex
  reminderTime?: string;
  specificDate?: string; // YYYY-MM-DD, if present, habit only exists on this date
}

export interface HabitLog {
  [date: string]: string[]; // date string (YYYY-MM-DD) -> array of completed habit IDs
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AISuggestion {
  habitName: string;
  description: string;
  reason: string;
}

export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
}