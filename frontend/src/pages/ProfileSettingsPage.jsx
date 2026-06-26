import React, { useRef, useState } from 'react';
import { User, Sun, Moon, Edit2, Plus, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfileSettingsPage = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await api.post('/auth/me/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(response.data);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your academic identity and AI learning preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Student Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" /> {user?.role === 'admin' ? 'Admin Profile' : 'Student Profile'}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex-shrink-0 bg-gray-200 dark:bg-gray-700 overflow-hidden transition-colors">
                   {user?.profile_picture_url ? (
                     <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 dark:text-gray-500">
                       {user?.full_name?.charAt(0)?.toUpperCase() || <User className="w-12 h-12" />}
                     </div>
                   )}
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleProfilePictureUpload} 
                     accept="image/*" 
                     className="hidden" 
                   />
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     disabled={isUploading}
                     className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-gray-800 shadow-sm hover:bg-primary-700 transition disabled:opacity-50"
                   >
                     {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit2 className="w-4 h-4" />}
                   </button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input type="text" defaultValue={user?.full_name || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-800 dark:text-white font-medium bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-800 dark:text-white font-medium bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800" />
                  </div>
                  {user?.role !== 'admin' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Grade / Level</label>
                        <select 
                          defaultValue={user?.grade_level || ''}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-800 dark:text-white font-medium bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 appearance-none"
                        >
                          <option value="">Select Grade</option>
                          <option value="Grade 11 - Junior">Grade 11 - Junior</option>
                          <option value="Grade 12 - Senior">Grade 12 - Senior</option>
                          <option value="Undergraduate">Undergraduate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">School / Institution</label>
                        <input 
                          type="text" 
                          defaultValue={user?.school || ''}
                          placeholder="Enter your school" 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800" 
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Interests (Student Only) */}
            {user?.role !== 'admin' && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-primary-600 dark:text-primary-400 font-serif font-bold text-xl ml-1 mr-1">A</span> Academic Interests
                </h2>
                
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl font-medium cursor-pointer border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-900" />
                    Advanced Mathematics
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl font-medium cursor-pointer border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-900" />
                    Quantum Physics
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-xl font-medium cursor-pointer border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 bg-white dark:bg-gray-800" />
                    World History
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl font-medium cursor-pointer border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-900" />
                    Computer Science
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-xl font-medium cursor-pointer border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 bg-white dark:bg-gray-800" />
                    English Literature
                  </label>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl font-medium border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition">
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>
                </div>
              </div>
            )}

            {/* Account Security */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md">
                   <svg width="12" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </span>
                Account Security
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Secure your account with 2FA.</p>
                  </div>
                  <button className="px-6 py-2 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Update Password</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Change your current login password.</p>
                  </div>
                  <button className="px-6 py-2 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition">
                    Change
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Appearance Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="border-2 border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 flex flex-col items-center gap-3 transition">
                  <Sun className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  <span className="font-bold text-gray-900 dark:text-white">Light Mode</span>
                </button>
                <button className="border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 rounded-2xl p-6 flex flex-col items-center gap-3 transition text-gray-400 dark:text-gray-500">
                  <Moon className="w-8 h-8" />
                  <span className="font-bold text-gray-600 dark:text-gray-400">Dark Mode</span>
                </button>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Notifications</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">AI Insights Summary</span>
                  <div className="w-11 h-6 bg-primary-600 rounded-full relative cursor-pointer flex items-center p-1">
                    <div className="bg-white w-4 h-4 rounded-full absolute right-1 shadow"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">New Lesson Alerts</span>
                  <div className="w-11 h-6 bg-primary-600 rounded-full relative cursor-pointer flex items-center p-1">
                    <div className="bg-white w-4 h-4 rounded-full absolute right-1 shadow"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Study Reminders</span>
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full relative cursor-pointer flex items-center p-1">
                    <div className="bg-white w-4 h-4 rounded-full absolute left-1 shadow border border-gray-200 dark:border-gray-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold shadow-sm hover:bg-primary-700 transition">
                Save Changes
              </button>
              <button className="w-full py-4 bg-primary-50 dark:bg-gray-700 text-primary-700 dark:text-gray-300 rounded-xl font-bold hover:bg-primary-100 dark:hover:bg-gray-600 transition">
                Discard Changes
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
