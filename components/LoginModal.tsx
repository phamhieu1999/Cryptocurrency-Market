import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Loader2, User as UserIcon, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, register, requestPasswordReset, clearError, resetPasswordResetStatus } from '../store/authSlice';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  
  const dispatch = useAppDispatch();
  const { status, error, isAuthenticated, passwordResetStatus } = useAppSelector((state) => state.auth);
  
  const isLoading = status === 'loading' || passwordResetStatus === 'loading';

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
      dispatch(resetPasswordResetStatus());
      setMode(initialMode);
      // Reset form fields mostly, except keep email if user typed it
      if (initialMode === 'signup') setName('');
    }
  }, [isOpen, initialMode, dispatch]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      dispatch(login({ email, password }));
    } else if (mode === 'signup') {
      dispatch(register({ name, email, password }));
    } else if (mode === 'forgot') {
      dispatch(requestPasswordReset(email));
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    dispatch(clearError());
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode('forgot');
    dispatch(clearError());
    dispatch(resetPasswordResetStatus());
  };

  const handleBackToLogin = () => {
    setMode('login');
    dispatch(clearError());
    dispatch(resetPasswordResetStatus());
  };

  const renderHeader = () => {
      switch(mode) {
          case 'login': return 'Log In';
          case 'signup': return 'Create Account';
          case 'forgot': return 'Reset Password';
          default: return '';
      }
  };

  // Forgot Password Success View
  if (mode === 'forgot' && passwordResetStatus === 'succeeded') {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 p-8 text-center">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
             </div>
             <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
             <p className="text-sm text-gray-500 mb-6">
                We have sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
             </p>
             <button 
                onClick={handleBackToLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
             >
                Back to Log In
             </button>
             <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
                <X size={20} />
             </button>
          </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
                {mode === 'forgot' && (
                    <button onClick={handleBackToLogin} className="text-gray-400 hover:text-gray-600 mr-2">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h2 className="text-xl font-bold text-gray-900">{renderHeader()}</h2>
            </div>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            {mode === 'forgot' && (
                <p className="text-sm text-gray-600 mb-4">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
            )}
            
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                    />
                </div>
                </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" onClick={handleForgotPasswordClick} className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {mode === 'login' ? 'Logging in...' : mode === 'signup' ? 'Creating account...' : 'Sending link...'}
                </>
              ) : (
                mode === 'login' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'
              )}
            </button>
          </form>

          {mode !== 'forgot' && (
            <div className="mt-6 text-center text-sm text-gray-500">
                {mode === 'login' ? (
                <>
                    Don't have an account? <button onClick={toggleMode} className="text-blue-600 font-bold hover:underline">Sign up</button>
                </>
                ) : (
                <>
                    Already have an account? <button onClick={toggleMode} className="text-blue-600 font-bold hover:underline">Log in</button>
                </>
                )}
            </div>
          )}
          
          {mode === 'forgot' && (
             <div className="mt-6 text-center text-sm">
                 <button onClick={handleBackToLogin} className="text-gray-500 font-medium hover:text-gray-900">Cancel</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};