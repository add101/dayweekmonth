import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';

const ErrorNotification = () => {
  const { error, clearError } = useStore();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification; 