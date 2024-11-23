import React from 'react';
import { ConfirmDialogProps } from '../types/game';

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 max-w-sm w-full mx-4">
        <p className="text-white text-lg mb-6 text-center">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};