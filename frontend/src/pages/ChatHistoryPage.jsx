import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Loader2, Sparkles, Calendar } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import FeedbackWidget from '../components/FeedbackWidget';

const ChatHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const subjects = ['All', 'Mathematics', 'Science', 'Programming', 'English', 'General Knowledge'];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/doubts/history');
        setHistory(response.data);
      } catch (error) {
        toast.error('Failed to load chat history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.ai_response?.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
            <span>Learning Portal</span>
            <span>›</span>
            <span className="text-primary-600 dark:text-primary-400 font-semibold">Chat History</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Conversations</h1>
          <p className="text-gray-500 dark:text-gray-400">Review your past questions and explanations.</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search in questions and answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-colors ${selectedSubject === subject ? 'bg-primary-600 text-white shadow-sm' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="space-y-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No history found</h3>
              <p className="text-gray-500 dark:text-gray-400">You haven't asked any questions matching your filters.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-200 hover:shadow-md">
                <div className="p-6 border-b border-gray-50 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {item.subject}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-start gap-3">
                    <span className="text-gray-400 dark:text-gray-500 mt-1">Q:</span>
                    {item.question}
                  </h3>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap">
                        {item.ai_response?.answer}
                      </div>
                      {item.ai_response?.key_points?.length > 0 && (
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 rounded-xl text-sm text-gray-800 dark:text-gray-300 space-y-2 mb-4">
                          <p className="font-bold mb-2">Key Points:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {item.ai_response.key_points.map((pt, i) => <li key={i}>{pt}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <FeedbackWidget doubtId={item.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatHistoryPage;
