import React, { useMemo } from 'react';
import { HabitLog, Habit } from '../types';
import { getLocalDateKey } from '../constants';

interface HeatMapProps {
  logs: HabitLog;
  habits: Habit[];
  currentDate: Date;
  onSelectDate: (date: Date) => void;
}

const HeatMap: React.FC<HeatMapProps> = ({ logs, habits, currentDate, onSelectDate }) => {
  const days = useMemo(() => {
    const result = [];
    // We want a grid that looks like the screenshot (approx 7 columns by 5-6 rows)
    // Let's generate a view starting from the first of the current month, padding with prev month
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    
    const startDate = new Date(firstDayOfMonth);
    // Adjust to start on Monday (if today is Sunday (0), go back 6 days, etc.)
    const dayOfWeek = startDate.getDay(); // 0 = Sun, 1 = Mon
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Generate 35 cells (5 weeks) to keep it compact and clean
    for (let i = 0; i < 35; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      result.push(d);
    }
    return result;
  }, [currentDate]);

  const getIntensityColor = (date: Date) => {
    const dateStr = getLocalDateKey(date);
    const completedIds = logs[dateStr] || [];
    
    // Find all habits that are relevant for THIS specific date
    // 1. Recurring habits (no specificDate)
    // 2. One-off habits for this date (specificDate === dateStr)
    const habitsForDate = habits.filter(h => !h.specificDate || h.specificDate === dateStr);
    
    if (habitsForDate.length === 0) return 'bg-gray-200 dark:bg-zinc-800'; // No habits to track

    const activeHabitIds = new Set(habitsForDate.map(h => h.id));
    const validCompletions = completedIds.filter(id => activeHabitIds.has(id)).length;

    const percentage = validCompletions / habitsForDate.length;

    // Screenshot aesthetic: Green shades
    if (percentage === 0) return 'bg-gray-200 dark:bg-zinc-800';
    if (percentage <= 0.25) return 'bg-brand-200 dark:bg-brand-900/40';
    if (percentage <= 0.50) return 'bg-brand-300 dark:bg-brand-800/60';
    if (percentage <= 0.75) return 'bg-brand-400 dark:bg-brand-600/80';
    return 'bg-brand-500 dark:bg-brand-500'; // Full completion
  };

  const isSelected = (d: Date) => getLocalDateKey(d) === getLocalDateKey(currentDate);
  const isToday = (d: Date) => getLocalDateKey(d) === getLocalDateKey(new Date());

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, idx) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          return (
            <button
              key={idx}
              onClick={() => onSelectDate(date)}
              className={`
                aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all duration-200 relative
                ${getIntensityColor(date)}
                ${!isCurrentMonth ? 'opacity-30' : 'opacity-100'}
                ${isSelected(date) ? 'ring-2 ring-brand-600 dark:ring-white scale-110 z-10' : 'hover:scale-105'}
                ${isToday(date) ? 'font-bold' : ''}
              `}
            >
              <span className={`
                ${isSelected(date) || getIntensityColor(date).includes('bg-brand') ? 'text-brand-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
              `}>
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeatMap;