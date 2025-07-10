import React from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import useStore from '../store/useStore';

const Auth = () => {
  const { user, loading, signIn, signOut } = useStore();

  const handleSignIn = async () => {
    await signIn();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSignIn}
          className="flex items-center space-x-2 px-4 py-2 bg-[#e5de44] text-[#151633] rounded-lg hover:bg-[#e5de44]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <LogIn size={18} />
          <span>Sign in with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* User Profile */}
      <div className="flex items-center space-x-3">
        {user.photoURL ? (
                  <img
          src={user.photoURL}
          alt={user.displayName || user.email}
          className="w-8 h-8 rounded-full ring-2 ring-[#e5de44]/30"
        />
        ) : (
          <div className="w-8 h-8 bg-[#e5de44] rounded-full flex items-center justify-center">
            <User size={16} className="text-[#151633]" />
          </div>
        )}
        
        <div className="hidden md:block">
          <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
            {user.displayName || 'User'}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400">
            {user.email}
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1c375c]/50 rounded-lg transition-colors border border-transparent dark:hover:border-[#e5de44]/20"
        title="Sign out"
      >
        <LogOut size={18} />
        <span className="hidden md:inline">Sign out</span>
      </button>
    </div>
  );
};

export default Auth; 