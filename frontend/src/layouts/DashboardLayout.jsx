import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Sparkles, LineChart, FileText, Settings, LogOut, HelpCircle, Moon, Sun, MessageSquare, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';
import useAuth from '../hooks/useAuth';

// Utility for tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DashboardLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  
  const navItems = user?.role === 'admin'
    ? [
        { name: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Feedbacks', icon: MessageSquare, path: '/admin/feedbacks' },
        { name: 'Settings', icon: Settings, path: '/settings' },
      ]
    : [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'AI Chat', icon: Sparkles, path: '/chat' },
        { name: 'Analytics', icon: LineChart, path: '/analytics' },
        { name: 'Saved Notes', icon: FileText, path: '/notes' },
        { name: 'Settings', icon: Settings, path: '/settings' },
      ];

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-900 font-sans overflow-hidden transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col flex-shrink-0 transition-colors duration-200">
        <div className="p-6">
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-xl font-bold text-primary-600 dark:text-primary-400 block">EduAI</Link>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {user?.role === 'admin' ? 'Admin Portal' : 'Learning Portal'}
          </span>
        </div>

        {user?.role !== 'admin' && (
          <div className="px-4 mb-4">
            <Link to="/chat" className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20">
              <span className="text-lg">+</span> Ask New Doubt
            </Link>
          </div>
        )}

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            {user?.profile_picture_url ? (
              <img src={user.profile_picture_url} alt="Profile" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800">
                {user?.full_name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{user?.full_name || 'User'}</h3>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <HelpCircle className="w-5 h-5" />
            Help Center
          </button>
          <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
