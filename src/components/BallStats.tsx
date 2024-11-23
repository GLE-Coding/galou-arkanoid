import React from 'react';
import { BallEffects, PaddleStats } from '../types/game';
import { Gauge, Swords, Rocket } from 'lucide-react';

interface BallStatsProps {
  effects: BallEffects;
  damage: number;
  paddleStats: PaddleStats;
}

export const BallStats: React.FC<BallStatsProps> = ({ effects, damage, paddleStats }) => {
  const formatPercentage = (value: number) => {
    const percentage = Math.round((value - 1) * 100);
    return percentage >= 0 ? `+${percentage}%` : `${percentage}%`;
  };

  const formatSpeed = (baseSpeed: number, multiplier: number) => {
    const actualSpeed = Math.round(baseSpeed * multiplier);
    return `${actualSpeed} ( ${formatPercentage(multiplier)} )`;
  };

  return (
    <div className="bg-gray-800 bg-opacity-90 p-3 md:p-4 rounded-lg border-2 border-purple-500 w-full lg:w-auto">
      <h3 className="text-purple-400 font-bold mb-2 text-sm md:text-base">Ball Stats</h3>
      <div className="space-y-2">
        <div className="flex items-center text-gray-200 text-sm md:text-base">
          <Gauge className="mr-2" size={16} />
          <span>Speed: {formatSpeed(3.5, effects.speedMultiplier)}</span>
        </div>
        <div className="flex items-center text-gray-200 text-sm md:text-base">
          <Swords className="mr-2" size={16} />
          <span>
            Damage: {damage.toFixed(1)} ( {formatPercentage(effects.damageMultiplier)} )
          </span>
        </div>
        {paddleStats.hasMissileLauncher && (
          <div className="flex items-center text-gray-200 text-sm md:text-base">
            <Rocket className="mr-2" size={16} />
            <span>Missiles: {paddleStats.missileAmmo}</span>
          </div>
        )}
      </div>
    </div>
  );
};