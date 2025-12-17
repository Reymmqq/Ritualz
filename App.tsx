import React, { useState, useEffect } from 'react';
import { Menu, Plus, Flame, Check, Moon, Sun, ChevronLeft, ChevronRight, Trash2, Calendar, Repeat } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import HeatMap from './components/HeatMap';
import NewHabitModal from './components/NewHabitModal';
import { Habit, HabitLog, ViewState } from './types';
import { MOCK_HABITS, generateMockHistory, getLocalDateKey } from './constants';
import { getMotivationalQuote } from './services/geminiService';

const App: React.FC = () => {
  // Application State
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  const [darkMode, setDarkMode] = useState(true); // Default dark as per image preference often
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data State
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [logs, setLogs] = useState<HabitLog>(generateMockHistory());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // UI State
  const [quote, setQuote] = useState("Loading motivation...");

  // Effects
  useEffect(() => {
    // Initialize Theme
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isSystemDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (view === ViewState.DASHBOARD) {
      loadQuote();
    }
  }, [view]);

  const loadQuote = async () => {
    const q = await getMotivationalQuote();
    setQuote(q);
  };

  // Handlers
  const handleToggleHabit = (habitId: string) => {
    const dateKey = getLocalDateKey(selectedDate);
    const currentCompleted = logs[dateKey] || [];
    const isCompleted = currentCompleted.includes(habitId);

    let newCompleted;
    if (isCompleted) {
      newCompleted = currentCompleted.filter(id => id !== habitId);
    } else {
      newCompleted = [...currentCompleted, habitId];
    }

    setLogs({
      ...logs,
      [dateKey]: newCompleted
    });

    // Simple Streak Logic (only if toggling today)
    const isToday = getLocalDateKey(new Date()) === dateKey;
    if (isToday) {
       setHabits(prev => prev.map(h => {
         if (h.id === habitId) {
           return { ...h, streak: isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1 };
         }
         return h;
       }));
    }
  };

  const handleAddHabit = (newHabitData: any) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      streak: 0,
      color: 'bg-indigo-500', // Default color
      ...newHabitData
    };
    setHabits([...habits, newHabit]);
  };

  const handleDeleteHabit = (habitId: string) => {
    // Removed window.confirm for immediate feedback and smoother UX
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const cycleMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const isHabitCompleted = (id: string) => {
    const dateKey = getLocalDateKey(selectedDate);
    return logs[dateKey]?.includes(id) || false;
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const selectedDateKey = getLocalDateKey(selectedDate);
  
  // Separate recurring habits from specific tasks for the day
  const dailyHabits = habits.filter(h => !h.specificDate);
  const specificTasks = habits.filter(h => h.specificDate === selectedDateKey);

  const renderHabitItem = (habit: Habit, isSpecific: boolean) => {
    const completed = isHabitCompleted(habit.id);
    return (
      <div 
        key={habit.id}
        onClick={() => handleToggleHabit(habit.id)}
        className={`
          group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 cursor-pointer
          ${completed ? 'bg-white dark:bg-dark-card shadow-sm' : 'bg-gray-50 dark:bg-dark-card border border-dashed border-gray-200 dark:border-gray-700'}
        `}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className={`
              w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors duration-300
              ${completed ? 'bg-brand-500 border-brand-500' : 'border-gray-300 dark:border-gray-600'}
            `}>
              {completed && <Check size={14} className="text-white" />}
            </div>
            
            <div className="flex flex-col">
              <span className={`font-semibold text-base transition-all ${completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {habit.name}
              </span>
              <div className="flex items-center gap-2">
                {habit.reminderTime && (
                    <span className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      🔔 {habit.reminderTime}
                    </span>
                )}
                {isSpecific && (
                   <span className="text-xs text-brand-500 bg-brand-100 dark:bg-brand-900/30 px-1.5 py-0.5 rounded font-medium">
                     Today Only
                   </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
              {!isSpecific && (
                 <div className="flex items-center gap-1 text-orange-500">
                    <Flame size={16} className={habit.streak > 0 ? "fill-orange-500" : "text-gray-300 dark:text-gray-700"} />
                    <span className={`text-xs font-bold ${habit.streak > 0 ? "" : "text-gray-300 dark:text-gray-700"}`}>{habit.streak}</span>
                 </div>
              )}

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteHabit(habit.id);
                }}
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-300 hover:text-red-500 transition-colors z-20 relative"
                title="Delete item"
              >
                <Trash2 size={18} />
              </button>
          </div>
        </div>
        
        {/* Subtle progress background fill effect */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-brand-50 to-transparent dark:from-brand-900/20 opacity-0 transition-opacity duration-500 pointer-events-none
          ${completed ? 'opacity-100' : ''}
        `} />
      </div>
    );
  };

  // Render Auth
  if (view === ViewState.AUTH) {
    return (
      <AuthScreen 
        onLogin={() => setView(ViewState.DASHBOARD)} 
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors duration-300 flex justify-center">
      
      <div className="w-full max-w-md bg-white dark:bg-dark-bg min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="px-6 py-6 flex items-center justify-between z-10">
          <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Menu className="text-gray-600 dark:text-gray-300" size={24} />
          </button>
          
          <div className="flex flex-col items-center">
             <h2 className="text-lg font-semibold">{formatDate(selectedDate)}</h2>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="text-gray-600 dark:text-gray-300" size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 px-6 overflow-y-auto no-scrollbar pb-24">
          
          {/* Month Navigation for Heatmap Context */}
          <div className="flex justify-between items-center mb-4 px-2">
             <button onClick={() => cycleMonth(-1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
               <ChevronLeft size={20} className="text-gray-400" />
             </button>
             <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
               {selectedDate.toLocaleDateString('en-US', { month: 'long' })}
             </span>
             <button onClick={() => cycleMonth(1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
               <ChevronRight size={20} className="text-gray-400" />
             </button>
          </div>

          {/* Heatmap */}
          <section className="mb-8">
            <HeatMap 
              logs={logs} 
              habits={habits} 
              currentDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </section>

          {/* Motivational Quote (AI) */}
          <div className="mb-8 p-4 rounded-xl bg-orange-100/50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/20 text-center">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200 italic">"{quote}"</p>
          </div>

          {/* Habits Lists */}
          <div className="space-y-6">
            
            {/* 1. Tasks for Specific Date (if any) */}
            {specificTasks.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 px-1">
                   <Calendar size={14} />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Tasks for {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'short' })}</h3>
                </div>
                {specificTasks.map(h => renderHabitItem(h, true))}
              </section>
            )}

            {/* 2. Daily Recurring Habits */}
            <section className="space-y-3">
              {dailyHabits.length > 0 && (specificTasks.length > 0) && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 px-1 mt-6">
                   <Repeat size={14} />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Daily Rituals</h3>
                </div>
              )}
              {dailyHabits.map(h => renderHabitItem(h, false))}
              
              {dailyHabits.length === 0 && specificTasks.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <p>No habits for this day.</p>
                  <button onClick={() => setIsModalOpen(true)} className="text-brand-500 text-sm mt-2 hover:underline">Create one?</button>
                </div>
              )}
            </section>
          </div>

        </main>

        {/* Floating Theme Toggle (Bottom Left) */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="absolute bottom-6 left-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg z-20 text-gray-600 dark:text-white hover:scale-110 transition-transform pointer-events-auto"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
           {/* Can add background blobs here if needed */}
        </div>
      </div>

      <NewHabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddHabit}
        selectedDateStr={selectedDateKey}
      />
    </div>
  );
};

export default App;