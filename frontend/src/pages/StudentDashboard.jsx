import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Trophy, MessageSquare, History, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recentChats, setRecentChats] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [historyRes, analyticsRes] = await Promise.all([
          api.get('/doubts/history'),
          api.get('/analytics/student')
        ]);
        setRecentChats(historyRes.data.slice(0, 3));
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-8 max-w-4xl">
        
        {/* Welcome Banner */}
        <div className="bg-primary-600 dark:bg-primary-700 rounded-3xl p-8 text-white shadow-lg shadow-primary-600/20 dark:shadow-none transition-colors duration-200">
          <h1 className="text-4xl font-bold mb-4">Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!</h1>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl">
            Ready to master Data Science today? Your personal AI tutor is waiting to clear your doubts and help you excel.
          </p>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl flex items-center shadow-inner transition-colors duration-200">
            <input 
              type="text" 
              placeholder="Ask your doubt right now..." 
              className="flex-1 bg-transparent px-4 py-2 text-gray-800 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
            <Link to="/chat" className="bg-primary-600 dark:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-primary-700 dark:hover:bg-primary-600 transition">
              <Sparkles className="w-4 h-4" /> Ask AI
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between transition-colors duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">Active</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{analytics?.monthly_progress || 0}%</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Monthly Progress</p>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${analytics?.monthly_progress || 0}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between transition-colors duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg">Total</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{analytics?.total_doubts_resolved || 0}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Doubts Resolved</p>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (analytics?.total_doubts_resolved || 0) * 5)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between transition-colors duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">Ranked</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{analytics?.learning_score || 0}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Learning XP Points</p>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-orange-600 dark:bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (analytics?.learning_score || 0) / 10)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Subjects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Subjects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(!analytics?.subject_breakdown || analytics.subject_breakdown.length === 0) ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center h-32 col-span-2 transition-colors duration-200">
                <Sparkles className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Ask questions to see your top subjects here</p>
              </div>
            ) : (
              analytics.subject_breakdown.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors duration-200">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.subject}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.count} Doubts Resolved</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Right Sidebar - Recent Chats */}
      <div className="w-80 flex-shrink-0 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Recent Chats
            </h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentChats.length === 0 ? (
              <div className="text-center py-10">
                <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent chats. Start asking questions!</p>
              </div>
            ) : (
              recentChats.map(chat => (
                <div key={chat.id} className="group cursor-pointer">
                  <div className="flex gap-3 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <History className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition truncate pr-2">
                          {chat.question}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {chat.ai_response?.answer || "No response recorded."}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link to="/history" className="w-full mt-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition block">
            View Chat History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
