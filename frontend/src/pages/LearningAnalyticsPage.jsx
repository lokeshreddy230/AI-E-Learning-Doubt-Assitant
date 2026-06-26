import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, CheckCircle, Flame, Medal, BookOpen, Users, Globe, Trophy, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const LearningAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/student');
        setAnalytics(response.data);
      } catch (error) {
        toast.error('Failed to load learning analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const chartData = analytics?.weekly_activity || [
    { name: 'Mon', interactions: 0 },
    { name: 'Tue', interactions: 0 },
    { name: 'Wed', interactions: 0 },
    { name: 'Thu', interactions: 0 },
    { name: 'Fri', interactions: 0 },
    { name: 'Sat', interactions: 0 },
    { name: 'Sun', interactions: 0 },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Learning Performance</h1>
            <p className="text-gray-500 dark:text-gray-400">Detailed insights into your academic journey and AI collaboration.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-3 rounded-2xl border border-blue-100 dark:border-blue-800 text-center transition-colors">
              <span className="block text-xl font-bold text-blue-600 dark:text-blue-400">{analytics?.learning_score || 0}</span>
              <span className="text-xs font-semibold text-blue-600/70 dark:text-blue-400/70 uppercase">Score</span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-3 rounded-2xl border border-purple-100 dark:border-purple-800 text-center transition-colors">
              <span className="block text-xl font-bold text-purple-600 dark:text-purple-400">N/A</span>
              <span className="text-xs font-semibold text-purple-600/70 dark:text-purple-400/70 uppercase">Current Grade</span>
            </div>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{analytics?.total_doubts_resolved || 0}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Doubts Resolved</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">Top 5%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{analytics?.total_notes_saved || 0}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Notes Saved</p>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-purple-600 p-6 rounded-3xl shadow-lg shadow-primary-600/20 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Flame className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">{analytics?.current_streak_days || 0} Day Streak</span>
              </div>
            </div>
            <div className="relative z-10">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium transition">Keep it up!</button>
              <div className="flex gap-2 mt-6">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full ${i < (analytics?.current_streak_days || 0) ? 'bg-white' : 'bg-white/30'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Activity</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Interactions vs. Time Spent</p>
              </div>
              <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="interactions" stroke="#4f46e5" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                  <CartesianGrid stroke="#f3f4f6" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis hide={true} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Most Explored</h3>
            <div className="space-y-6">
              {analytics?.subject_breakdown?.map((subject, index) => {
                const colors = ['bg-blue-600', 'bg-purple-600', 'bg-green-500', 'bg-orange-500', 'bg-red-500'];
                const colorClass = colors[index % colors.length];
                const percentage = Math.min(100, Math.max(10, (subject.count / Math.max(1, analytics.total_doubts_resolved)) * 100));
                
                return (
                  <div key={subject.subject}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{subject.subject}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{subject.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                      <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {(!analytics?.subject_breakdown || analytics.subject_breakdown.length === 0) && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No subjects explored yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievement Badges</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Badges and achievements coming soon!</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningAnalyticsPage;
