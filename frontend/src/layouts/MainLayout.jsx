import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
        <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">EduAI</Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/login" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">Login</Link>
          <Link to="/register" className="text-sm font-medium bg-primary-600 text-white px-5 py-2.5 rounded-full hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/30">Get Started</Link>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-semibold text-primary-600">EduAI</span>
            <p className="mt-1">© 2024 EduAI. Empowering learners through intelligent AI support.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Contact Us</a>
            <a href="#" className="hover:text-gray-900">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
