import React, { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, Star, Flag, ShieldCheck, Search, MoreVertical, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [topics, setTopics] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes, topicsRes, feedbacksRes] = await Promise.all([
          api.get('/admin/statistics'),
          api.get('/admin/users'),
          api.get('/admin/topics'),
          api.get('/admin/feedback')
        ]);
        setStats(statsRes.data);
        setUsersList(usersRes.data);
        setTopics(topicsRes.data);
        setFeedbacks(feedbacksRes.data);
      } catch (error) {
        toast.error('Failed to load admin dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

  const filteredUsers = usersList.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use topics for the bar chart
  const chartData = topics.map(t => ({ name: t.subject, value: t.count }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const avgFeedback = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) 
    : 'N/A';

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Insights</h1>
            <p className="text-gray-500 dark:text-gray-400">Real-time performance metrics across the EduAI ecosystem.</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border border-blue-200 dark:border-blue-800 transition-colors">
             <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
             LIVE STATUS
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">+Active</span>
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.total_users || 0}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">{stats?.platform_health || 'Unknown'}</span>
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Doubts</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.total_doubts || 0}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Trending Subject</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{topics[0]?.subject || 'N/A'}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Avg Feedback</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{avgFeedback} <span className="text-lg">/ 5</span></h3>
          </div>
        </div>

        {/* Charts & Queue Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Topics Breakdown</h2>
            </div>
            <div className="h-[250px] w-full mt-4">
              {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} barSize={40}>
                   <CartesianGrid vertical={false} stroke="#f3f4f6" strokeOpacity={0.1} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                   <YAxis hide />
                   <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.1)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                   <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                     {
                       chartData.map((entry, index) => (
                         <cell key={`cell-${index}`} fill={index === 0 ? '#1d4ed8' : '#3b82f6'} />
                       ))
                     }
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Recent Feedback
            </h2>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[250px] pr-2">
              
              {feedbacks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No feedback submitted yet.</p>
              ) : (
                feedbacks.slice(0, 5).map(f => (
                  <div key={f.id} className="p-4 border border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl flex gap-4 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{f.rating}/5 Stars</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{f.comments || f.question}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {feedbacks.length > 5 && (
              <button className="w-full mt-4 py-3 text-center text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition">
                View all reports ({feedbacks.length})
              </button>
            )}
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active User Management</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none w-full md:w-64 transition-colors" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-50/50 dark:bg-primary-900/20 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profile_picture_url ? (
                            <img src={user.profile_picture_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-purple-200 dark:border-purple-800" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 font-bold flex items-center justify-center">
                              {user.email.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'} border`}>
                          {user.role === 'admin' ? 'Admin' : 'Student'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 border">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Showing {filteredUsers.length} of {usersList.length} users</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
