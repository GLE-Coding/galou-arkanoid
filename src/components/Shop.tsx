import React from 'react';
import { CreditCard, X } from 'lucide-react';
import { Upgrade } from '../types/game';

interface ShopProps {
  isOpen: boolean;
  money: number;
  upgrades: Upgrade[];
  onClose: () => void;
  onPurchase: (upgrade: Upgrade) => void;
}

export const Shop: React.FC<ShopProps> = ({ isOpen, money, upgrades, onClose, onPurchase }) => {
  if (!isOpen) return null;

  const isGodMode = money === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 touch-none">
      <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-400">Upgrade Shop</h2>
          <div className="flex items-center space-x-4">
            {!isGodMode && (
              <div className="flex items-center text-green-400">
                <CreditCard className="mr-2" />
                <span className="text-xl font-bold">${money}</span>
              </div>
            )}
            {isGodMode && (
              <div className="flex items-center text-yellow-400">
                <span className="text-xl font-bold">GOD MODE</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {upgrades.map((upgrade) => (
            <div
              key={upgrade.id}
              className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors"
            >
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">{upgrade.name}</h3>
              <p className="text-gray-300 mb-4 text-sm md:text-base">{upgrade.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold">
                  {isGodMode ? "FREE" : `$${upgrade.cost}`}
                </span>
                <button
                  onClick={() => onPurchase(upgrade)}
                  disabled={money < upgrade.cost && !isGodMode}
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    (money >= upgrade.cost || isGodMode)
                      ? 'bg-purple-600 text-white hover:bg-purple-500'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-lg md:text-xl font-bold"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};