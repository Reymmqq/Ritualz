import React, { useState } from 'react';
import { Flame, Mail, Lock, Apple, Sun, Moon } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, darkMode, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-fade-in relative z-10 bg-gray-100 dark:bg-dark-bg transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 backdrop-blur-md transition-all shadow-sm text-gray-600 dark:text-gray-300"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="mb-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20 mb-6">
          <Flame className="text-white fill-white" size={40} />
        </div>
        <h1 className="text-3xl font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">Ritualz</h1>
        <p className="text-gray-400 dark:text-gray-600 mt-2 font-light">Minimal aesthetic</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="text-gray-400" size={20} />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-dark-input border border-transparent focus:border-gray-300 dark:focus:border-gray-600 shadow-sm outline-none transition-all dark:text-white"
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="text-gray-400" size={20} />
          </div>
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-dark-input border border-transparent focus:border-gray-300 dark:focus:border-gray-600 shadow-sm outline-none transition-all dark:text-white"
          />
        </div>

        <div className="flex justify-end">
          <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Forgot Password?
          </button>
        </div>

        <button 
          onClick={onLogin}
          className="w-full py-4 bg-white dark:bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-50 transform hover:scale-[1.02] transition-all"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <span className="relative px-4 bg-gray-100 dark:bg-dark-bg text-sm text-gray-400">Or sign in with</span>
        </div>

        <div className="flex justify-center gap-4">
          <button className="w-16 h-16 bg-white dark:bg-dark-card rounded-2xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
            <Apple size={24} className="text-gray-900 dark:text-white" />
          </button>
          <button className="w-16 h-16 bg-white dark:bg-dark-card rounded-2xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
             <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        {isLogin ? "Don't have an account?" : "Already have an account?"} 
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="ml-1 font-semibold text-gray-900 dark:text-white hover:underline"
        >
           {isLogin ? 'Register now' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;