import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Paperclip, Image as ImageIcon, Sigma, Send, Bell, Lightbulb, BarChart2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { SkeletonMessage } from '../components/SkeletonLoader';
import FeedbackWidget from '../components/FeedbackWidget';

const AIChatInterface = () => {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await api.post('/doubts/ask', {
        question: currentQuestion
      });
      
      const aiResponse = response.data.ai_response;
      setMessages(prev => [...prev, {
        role: 'ai',
        content: aiResponse,
        id: response.data.id,
        subject: response.data.subject,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to get answer. Please try again.');
      setMessages(prev => prev.slice(0, -1)); // Remove the user message on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const setDemoQuestion = (q) => {
    setQuestion(q);
  };

  const handleSaveNote = async (msg) => {
    try {
      const noteData = {
        title: msg.content.summary ? msg.content.summary.substring(0, 50) + "..." : "Saved AI Response",
        content: JSON.stringify({
          subject: msg.subject || "General Knowledge",
          question: messages[messages.indexOf(msg) - 1]?.content || "Unknown Question",
          answer: msg.content.answer,
          key_points: msg.content.key_points || [],
          summary: msg.content.summary || ""
        })
      };
      await api.post('/notes', noteData);
      toast.success('Note saved successfully!');
    } catch (error) {
      toast.error('Failed to save note.');
    }
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 relative transition-colors duration-200">
      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 h-16 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          {/* Logo or Title could go here */}
          <span className="font-bold text-gray-800 dark:text-gray-200">EduAI</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center overflow-hidden">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col pt-16 h-full border-r border-gray-100 dark:border-gray-800">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-40">
          
          {messages.length === 0 && !isLoading && (
            <div className="max-w-2xl mx-auto text-center mt-12 mb-16">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How can I help you learn today?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Ask me anything from solving calculus problems to explaining the Schrodinger's equation.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <button onClick={() => setDemoQuestion("Derive the Quadratic Formula")} className="p-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-md transition bg-white dark:bg-gray-800 group text-left">
                  <p className="font-semibold text-primary-600 dark:text-primary-400 mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300">Derive the Quadratic Formula</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Show step-by-step derivation with explanations.</p>
                </button>
                <button onClick={() => setDemoQuestion("Explain Photosynthesis")} className="p-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-md transition bg-white dark:bg-gray-800 group text-left">
                  <p className="font-semibold text-primary-600 dark:text-primary-400 mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300">Explain Photosynthesis</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Use a biological analogy for better understanding.</p>
                </button>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-primary-600 text-white px-6 py-4 rounded-2xl rounded-br-sm max-w-xl shadow-sm">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 max-w-3xl group">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-6 py-5 rounded-2xl rounded-bl-sm shadow-sm flex-1 relative">
                    <button 
                      onClick={() => handleSaveNote(msg)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Save to Notes"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </button>
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap pr-8">
                      {msg.subject && (
                        <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-md mb-3 border border-primary-200 dark:border-primary-800/50">
                          {msg.subject}
                        </span>
                      )}
                      <br/>
                      {msg.content.answer}
                    </div>
                    {msg.content.key_points?.length > 0 && (
                      <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl text-sm text-gray-800 dark:text-gray-300 space-y-2 mb-4">
                        <p className="font-bold mb-2">Key Points:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {msg.content.key_points.map((pt, i) => <li key={i}>{pt}</li>)}
                        </ul>
                      </div>
                    )}
                    {msg.content.summary && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic text-sm border-l-2 border-primary-500 pl-3 mb-4">
                        {msg.content.summary}
                      </p>
                    )}
                    
                    {msg.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <FeedbackWidget doubtId={msg.id} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col gap-2 w-full max-w-3xl">
              <SkeletonMessage isAI={true} />
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 pl-16">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium animate-pulse">Generating educational explanation...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-80 bg-gradient-to-t from-white via-white dark:from-gray-900 dark:via-gray-900 to-transparent pt-10 pb-6 px-8 z-20">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-lg max-w-4xl mx-auto transition-colors duration-200">
            <textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your academic question here... (Press Enter to send, Shift+Enter for new line)" 
              className="w-full max-h-32 min-h-[60px] bg-transparent px-4 py-3 text-gray-800 dark:text-white outline-none resize-none"
              rows="2"
              disabled={isLoading}
            ></textarea>
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <Sigma className="w-5 h-5" />
                </button>
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !question.trim()}
                className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
          <p className="text-center text-xs text-gray-400 mt-3 font-medium tracking-wide uppercase">EduAI may occasionally provide incorrect information. Verify key facts.</p>
        </div>
      </div>

      {/* Right Sidebar - Context */}
      <aside className="w-80 bg-gray-50 dark:bg-gray-800/50 h-full pt-20 px-6 overflow-y-auto border-l border-gray-100 dark:border-gray-800 hidden lg:block transition-colors duration-200">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Key Takeaways</h3>
        
        <div className="space-y-4 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors duration-200">
            <Lightbulb className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Ask questions to see your key takeaways appear here.</p>
          </div>
        </div>

        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Recent Explorations</h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors duration-200">
          <p className="text-sm text-gray-500 dark:text-gray-400">Your recent topics will be tracked here.</p>
        </div>
      </aside>

    </div>
  );
};

export default AIChatInterface;
