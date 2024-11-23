import React, { useEffect, useState } from 'react';
import { ComboState } from '../types/game';
import { Flame } from 'lucide-react';

interface ComboDisplayProps {
  combo?: ComboState;
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({ combo }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (combo?.isActive) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [combo?.timestamp]);

  if (!visible || !combo) return null;

  return (
    <div className="bg-gray-800 bg-opacity-90 p-3 md:p-4 rounded-lg border-2 border-purple-500 w-full lg:w-auto">
      <div className="flex items-center justify-center mb-2">
        <Flame className="text-orange-500 mr-2" size={20} />
        <span className="text-xl md:text-2xl font-bold text-orange-500">
          {combo.count}x Combo!
        </span>
      </div>
      <div className="text-green-400 font-bold text-center text-base md:text-lg">
        +${combo.earnings}
      </div>
    </div>
  );
};