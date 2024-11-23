import React from 'react';
import { ConfirmDialogProps } from '../types/game';
import { X } from 'lucide-react';

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 touch-none">
      <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-400">Exit Game</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-300 text-lg mb-8 text-center">{message}</p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-lg font-bold"
          >
            Exit to Menu
          </button>
          <button
            onClick={onCancel}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-lg font-bold"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};