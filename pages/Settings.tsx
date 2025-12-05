import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateSettings } from '../store/userSlice';
import { User, Bell, Shield, Moon, Globe, Save } from 'lucide-react';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector(state => state.user);
  
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSettings({ displayName }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="space-y-1">
               <button className="w-full text-left px-4 py-3 bg-white text-blue-600 font-bold border-l-4 border-blue-600 shadow-sm rounded-r-lg">
                  Profile
               </button>
               <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 font-medium border-l-4 border-transparent rounded-r-lg transition-colors">
                  Notifications
               </button>
               <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 font-medium border-l-4 border-transparent rounded-r-lg transition-colors">
                  Security
               </button>
               <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 font-medium border-l-4 border-transparent rounded-r-lg transition-colors">
                  Appearance
               </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 space-y-6">
               
               {/* Profile Card */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <User size={20} className="text-gray-500" /> Public Profile
                  </h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                     <img src={settings.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-gray-100" />
                     <div>
                        <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 text-sm">
                           Change Avatar
                        </button>
                        <p className="text-xs text-gray-400 mt-2">JPG, GIF or PNG. Max 1MB.</p>
                     </div>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                           <input 
                              type="text" 
                              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                           <input 
                              type="email" 
                              className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                              value={settings.email}
                              disabled
                           />
                        </div>
                     </div>
                     
                     <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button 
                           type="submit" 
                           className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-colors ${isSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                           {isSaved ? 'Saved!' : 'Save Changes'}
                        </button>
                     </div>
                  </form>
               </div>

               {/* Preferences Card */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                   <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <Globe size={20} className="text-gray-500" /> Preferences
                  </h2>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className="bg-white p-2 rounded-full shadow-sm">
                              <Moon size={18} className="text-gray-700" />
                           </div>
                           <div>
                              <div className="font-bold text-gray-900">Dark Mode</div>
                              <div className="text-xs text-gray-500">Reduce eye strain</div>
                           </div>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className="bg-white p-2 rounded-full shadow-sm">
                              <Globe size={18} className="text-gray-700" />
                           </div>
                           <div>
                              <div className="font-bold text-gray-900">Currency</div>
                              <div className="text-xs text-gray-500">Select your preferred currency</div>
                           </div>
                        </div>
                        <select className="bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500">
                           <option>USD ($)</option>
                           <option>EUR (€)</option>
                           <option>GBP (£)</option>
                        </select>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
};