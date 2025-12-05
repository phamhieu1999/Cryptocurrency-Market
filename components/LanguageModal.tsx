import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSettings } from '../store/userSlice';
import { SUPPORTED_LANGUAGES, useTranslation } from '../i18n/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { language, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLanguage = (code: string) => {
    dispatch(updateSettings({ language: code }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{t('modal.language.title')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
           <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                 type="text" 
                 placeholder={t('modal.language.search')}
                 className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 autoFocus
              />
           </div>
        </div>

        {/* Language Grid */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredLanguages.map(lang => (
                 <button 
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                       language === lang.code 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500' 
                          : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                 >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="flex flex-col min-w-0">
                       <span className={`text-sm font-bold truncate ${language === lang.code ? 'text-blue-900' : 'text-gray-900'}`}>
                          {lang.nativeName}
                       </span>
                       <span className={`text-xs truncate ${language === lang.code ? 'text-blue-600' : 'text-gray-500'}`}>
                          {lang.name}
                       </span>
                    </div>
                    {language === lang.code && <Check size={16} className="ml-auto text-blue-600 flex-shrink-0" />}
                 </button>
              ))}
           </div>
           
           {filteredLanguages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                 No languages found matching "{searchQuery}"
              </div>
           )}
        </div>
      </div>
    </div>
  );
};