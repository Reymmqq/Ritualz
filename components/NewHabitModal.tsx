import React, { useState } from 'react';
import { X, Sparkles, Loader2, Calendar, Repeat } from 'lucide-react';
import { getHabitSuggestions } from '../services/geminiService';
import { AISuggestion, Habit } from '../types';

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id' | 'streak' | 'color'>) => void;
  selectedDateStr: string;
}

const NewHabitModal: React.FC<NewHabitModalProps> = ({ isOpen, onClose, onSave, selectedDateStr }) => {
  const [name, setName] = useState('');
  const [reminder, setReminder] = useState('');
  const [isRecurring, setIsRecurring] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiGoal, setAiGoal] = useState('');

  if (!isOpen) return null;

  const handleAiSuggest = async () => {
    if (!aiGoal.trim()) return;
    setIsAiLoading(true);
    try {
      const results = await getHabitSuggestions(aiGoal);
      setSuggestions(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const selectSuggestion = (s: AISuggestion) => {
    setName(s.habitName);
    setSuggestions([]);
    setShowAiInput(false);
    setAiGoal('');
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name,
      reminderTime: reminder || undefined,
      emoji: '🔥', // Default, could be picked
      specificDate: isRecurring ? undefined : selectedDateStr
    });
    setName('');
    setReminder('');
    setIsRecurring(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-6 transform transition-all animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">New Entry</h2>

        {/* AI Toggle */}
        <div className="mb-4">
          <button 
            onClick={() => setShowAiInput(!showAiInput)}
            className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            <Sparkles size={16} />
            {showAiInput ? "Manual Entry" : "Get AI Suggestions"}
          </button>
        </div>

        {showAiInput ? (
          <div className="space-y-4 mb-6 bg-brand-50 dark:bg-brand-900/20 p-4 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What's your goal?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                placeholder="e.g. Sleep better, Learn Spanish..."
                className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-dark-input border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              />
              <button 
                onClick={handleAiSuggest}
                disabled={isAiLoading || !aiGoal}
                className="bg-brand-500 text-white p-2 rounded-lg hover:bg-brand-600 disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              </button>
            </div>
            
            {suggestions.length > 0 && (
              <div className="space-y-2 mt-2">
                <p className="text-xs text-gray-500">Tap to select:</p>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion(s)}
                    className="w-full text-left p-3 rounded-lg bg-white dark:bg-dark-card border border-brand-200 dark:border-brand-900 hover:bg-brand-50 dark:hover:bg-brand-900/40 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{s.habitName}</div>
                    <div className="text-xs text-gray-500 truncate">{s.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Read 30 mins"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-input border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                />
              </div>

              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-dark-input rounded-xl">
                <button
                  onClick={() => setIsRecurring(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    isRecurring 
                      ? 'bg-white dark:bg-dark-card shadow text-brand-600 dark:text-brand-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Repeat size={16} />
                  Repeat Daily
                </button>
                <button
                  onClick={() => setIsRecurring(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    !isRecurring 
                      ? 'bg-white dark:bg-dark-card shadow text-brand-600 dark:text-brand-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Calendar size={16} />
                  Just {new Date(selectedDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Daily Reminder (Optional)
                </label>
                <div className="flex items-center px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                  <input
                    type="time"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="bg-transparent outline-none w-full text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Quick suggestions chips */}
              <div className="flex flex-wrap gap-2">
                {['Drink Water', 'Read', 'Meditate', 'Run'].map(t => (
                  <button
                    key={t}
                    onClick={() => setName(t)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-700 transition-colors"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl bg-gray-900 dark:bg-brand-600 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {isRecurring ? "Create Daily Habit" : "Add Task for Date"}
        </button>
      </div>
    </div>
  );
};

export default NewHabitModal;