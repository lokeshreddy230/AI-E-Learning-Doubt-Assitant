import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Search, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/admin/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      toast.error('Failed to fetch feedback reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = feedbacks.filter(f => 
    (f.student_name && f.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.question && f.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.subject && f.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              Student Feedback
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Review ratings and comments left by students on AI explanations.</p>
          </div>
          
          <div className="relative max-w-sm w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by student, subject, or question..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
          </div>
        </div>

        {/* Feedback List */}
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-2xl border border-gray-100 dark:border-gray-700">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No feedback found.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Subject & Question</th>
                    <th className="px-6 py-4 font-semibold text-center">Rating</th>
                    <th className="px-6 py-4 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFeedbacks.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800">
                            {feedback.student_name ? feedback.student_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{feedback.student_name || 'Unknown Student'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{feedback.student_email || 'No email provided'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded mb-2">
                          {feedback.subject || 'General'}
                        </span>
                        <p className="text-gray-900 dark:text-gray-200 font-medium line-clamp-2">"{feedback.question}"</p>
                        {feedback.comments && feedback.comments !== "Rated from UI" && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 italic">
                            Comment: {feedback.comments}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {renderStars(feedback.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-gray-900 dark:text-gray-300 font-medium">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(feedback.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
