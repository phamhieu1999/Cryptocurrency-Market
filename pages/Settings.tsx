
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateSettings } from '../store/userSlice';
import { User, Bell, Shield, Moon, Globe, Save, Calendar, Globe as GlobeIcon, FileText, X, Check, Smartphone, Lock, Laptop, ChevronRight, DollarSign } from 'lucide-react';
import { LanguageModal } from '../components/LanguageModal';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

// Pre-defined avatars from DiceBear
const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Pepper',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Molly'
];

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector(state => state.user);
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance'); // Default to appearance for demo
  
  // Local state for forms
  const [formData, setFormData] = useState({
    displayName: settings.displayName,
    bio: settings.bio || '',
    website: settings.website || '',
    birthdate: settings.birthdate || '',
    avatarUrl: settings.avatarUrl
  });

  const [passwordForm, setPasswordForm] = useState({
      current: '',
      new: '',
      confirm: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Handle generic profile field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSettings(formData));
    showSaveSuccess();
  };

  const showSaveSuccess = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAvatarSelect = (url: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: url }));
    setIsAvatarModalOpen(false);
  };

  // --- Render Helpers ---

  const renderProfileTab = () => (
     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-in fade-in duration-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           <User size={20} className="text-gray-500" /> Public Profile
        </h2>
        
        <div className="flex items-center gap-6 mb-8">
           <div className="relative group">
              <img 
                 src={formData.avatarUrl} 
                 alt="Avatar" 
                 className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-slate-700 object-cover bg-gray-50" 
              />
              <button 
                 type="button"
                 onClick={() => setIsAvatarModalOpen(true)}
                 className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-800 hover:bg-blue-700 transition-colors"
                 title="Change Avatar"
              >
                 <User size={14} />
              </button>
           </div>
           <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{formData.displayName || 'User'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{settings.email}</p>
              <button 
                 type="button"
                 onClick={() => setIsAvatarModalOpen(true)}
                 className="mt-3 text-sm text-blue-600 font-bold hover:underline"
              >
                 Change Avatar
              </button>
           </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                 <input 
                    type="text" 
                    name="displayName"
                    className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    value={formData.displayName}
                    onChange={handleChange}
                 />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                 <input 
                    type="email" 
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    value={settings.email}
                    disabled
                 />
              </div>
              
              <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                 <div className="relative">
                    <FileText className="absolute top-3 left-3 text-gray-400" size={18} />
                    <textarea 
                       name="bio"
                       rows={3}
                       className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"
                       placeholder="Tell us a little about yourself..."
                       value={formData.bio}
                       onChange={handleChange}
                    />
                 </div>
                 <p className="text-xs text-gray-500 mt-1 text-right">{formData.bio.length}/160</p>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Website</label>
                 <div className="relative">
                    <GlobeIcon className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input 
                       type="url" 
                       name="website"
                       className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                       placeholder="https://your-website.com"
                       value={formData.website}
                       onChange={handleChange}
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Birthday</label>
                 <div className="relative">
                    <Calendar className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input 
                       type="date" 
                       name="birthdate"
                       className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                       value={formData.birthdate}
                       onChange={handleChange}
                    />
                 </div>
              </div>
           </div>
           
           <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
              <button 
                 type="submit" 
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-sm ${isSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                 {isSaved ? <Check size={18} /> : <Save size={18} />}
                 {isSaved ? 'Saved!' : 'Save Changes'}
              </button>
           </div>
        </form>
     </div>
  );

  const renderNotificationsTab = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-in fade-in duration-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           <Bell size={20} className="text-gray-500" /> Notification Preferences
        </h2>

        <div className="space-y-6">
            {[
                { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when your watchlist coins move significantly.' },
                { key: 'securityAlerts', label: 'Security Alerts', desc: 'Receive alerts about suspicious activity on your account.' },
                { key: 'newsletter', label: 'Weekly Newsletter', desc: 'Get the top crypto stories delivered to your inbox.' },
                { key: 'marketingEmails', label: 'Marketing Updates', desc: 'Receive offers and updates from our partners.' }
            ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white">{item.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                    </div>
                    <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                            onChange={(e) => {
                                const newNotifications = { ...settings.notifications, [item.key]: e.target.checked };
                                dispatch(updateSettings({ notifications: newNotifications }));
                                showSaveSuccess();
                            }}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"
                        />
                        <label 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-gray-300'}`}
                        ></label>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
        {/* Password */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Lock size={20} className="text-gray-500" /> Change Password
            </h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showSaveSuccess(); setPasswordForm({current:'', new:'', confirm:''}); }}>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                    <input 
                        type="password" 
                        className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                        <input 
                            type="password" 
                            className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                        <input 
                            type="password" 
                            className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                        Update Password
                    </button>
                </div>
            </form>
        </div>

        {/* 2FA */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={20} className="text-gray-500" /> Two-Factor Authentication (2FA)
            </h2>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Protect your account with an extra layer of security.</p>
                    <p className="text-xs text-gray-500">We recommend using Google Authenticator or Authy.</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            checked={settings.security.twoFactorEnabled}
                            onChange={(e) => {
                                const newSecurity = { ...settings.security, twoFactorEnabled: e.target.checked };
                                dispatch(updateSettings({ security: newSecurity }));
                                showSaveSuccess();
                            }}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"
                        />
                        <label 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.security.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
                        ></label>
                </div>
            </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Laptop size={20} className="text-gray-500" /> Active Sessions
            </h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Smartphone size={24} className="text-gray-400" />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-white text-sm">iPhone 14 Pro</div>
                            <div className="text-xs text-gray-500">San Francisco, US • Active now</div>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Current</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg opacity-70">
                    <div className="flex items-center gap-3">
                        <Laptop size={24} className="text-gray-400" />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-white text-sm">MacBook Pro</div>
                            <div className="text-xs text-gray-500">San Francisco, US • 2 days ago</div>
                        </div>
                    </div>
                    <button className="text-xs text-red-500 hover:underline">Revoke</button>
                </div>
            </div>
        </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-in fade-in duration-300">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Globe size={20} className="text-gray-500" /> Appearance & Language
        </h2>

        <div className="space-y-2">
            {/* Theme */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-slate-700">
                 <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-full">
                        <Moon size={20} className="text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white text-base">Dark Mode</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Easier on the eyes</div>
                    </div>
                </div>
                <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                    <input 
                        type="checkbox" 
                        checked={settings.theme === 'dark'}
                        onChange={(e) => dispatch(updateSettings({ theme: e.target.checked ? 'dark' : 'light' }))}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"
                    />
                    <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}></label>
                </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-slate-700">
                 <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-full">
                        <GlobeIcon size={20} className="text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white text-base">Language</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Change platform language</div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsLanguageModalOpen(true)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                >
                    {SUPPORTED_LANGUAGES.find(l => l.code === settings.language)?.nativeName || 'English'}
                    <ChevronRight size={16} className="text-gray-500" />
                </button>
            </div>

             {/* Currency */}
             <div className="flex items-center justify-between py-6">
                 <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-full">
                        <DollarSign size={20} className="text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white text-base">Currency</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fiat currency for display</div>
                    </div>
                </div>
                <div className="relative">
                    <select 
                        value={settings.currency}
                        onChange={(e) => dispatch(updateSettings({ currency: e.target.value }))}
                        className="appearance-none text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 border-none rounded-lg pl-4 pr-10 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="VND">VND (₫)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none rotate-90" />
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="space-y-1">
               <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 font-bold border-l-4 shadow-sm rounded-r-lg transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-800 text-blue-600 border-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200 border-transparent'}`}
               >
                  Profile
               </button>
               <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-3 font-bold border-l-4 shadow-sm rounded-r-lg transition-all ${activeTab === 'notifications' ? 'bg-white dark:bg-slate-800 text-blue-600 border-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200 border-transparent'}`}
               >
                  Notifications
               </button>
               <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 font-bold border-l-4 shadow-sm rounded-r-lg transition-all ${activeTab === 'security' ? 'bg-white dark:bg-slate-800 text-blue-600 border-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200 border-transparent'}`}
               >
                  Security
               </button>
               <button 
                   onClick={() => setActiveTab('appearance')}
                   className={`w-full text-left px-4 py-3 font-bold border-l-4 shadow-sm rounded-r-lg transition-all ${activeTab === 'appearance' ? 'bg-white dark:bg-slate-800 text-blue-600 border-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200 border-transparent'}`}
               >
                  Appearance
               </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
               {activeTab === 'profile' && renderProfileTab()}
               {activeTab === 'notifications' && renderNotificationsTab()}
               {activeTab === 'security' && renderSecurityTab()}
               {activeTab === 'appearance' && renderAppearanceTab()}
            </div>
         </div>
      </div>

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAvatarModalOpen(false)}></div>
           <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose Avatar</h3>
                 <button onClick={() => setIsAvatarModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                 {AVATAR_PRESETS.map((url, idx) => (
                    <button 
                       key={idx}
                       onClick={() => handleAvatarSelect(url)}
                       className={`relative rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${formData.avatarUrl === url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'}`}
                    >
                       <img src={url} alt={`Avatar ${idx}`} className="w-full h-full bg-gray-50" />
                    </button>
                 ))}
              </div>

              <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Or enter custom URL</label>
                 <div className="flex gap-2">
                    <input 
                       type="url" 
                       placeholder="https://example.com/avatar.png"
                       className="flex-grow border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                       value={customAvatarUrl}
                       onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    />
                    <button 
                       onClick={() => handleAvatarSelect(customAvatarUrl)}
                       disabled={!customAvatarUrl}
                       className="bg-gray-900 dark:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                    >
                       Set
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Language Modal Wrapper */}
      <LanguageModal 
        isOpen={isLanguageModalOpen} 
        onClose={() => setIsLanguageModalOpen(false)} 
      />
    </div>
  );
};
