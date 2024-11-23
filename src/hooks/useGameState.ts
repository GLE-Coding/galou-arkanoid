import { useState } from 'react';
import { GameState, ComboState } from '../types/game';

export const useGameState = (richMode: boolean = false) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [money, setMoney] = useState(richMode ? Number.MAX_SAFE_INTEGER : 0);
  const [combo, setCombo] = useState<ComboState>({
    count: 0,
    earnings: 0,
    isActive: false,
    timestamp: 0
  });

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setMoney(richMode ? Number.MAX_SAFE_INTEGER : 0);
    resetCombo();
  };

  const resetGame = () => {
    setGameState('menu');
    resetCombo();
  };

  const togglePause = () => {
    setGameState(state => state === 'playing' ? 'paused' : state === 'paused' ? 'playing' : state);
  };

  const openShop = () => {
    setGameState('shop');
  };

  const closeShop = () => {
    setGameState('playing');
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  const addScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const addMoney = (amount: number) => {
    if (!richMode) {
      setMoney(prev => prev + amount);
    }
  };

  const spendMoney = (amount: number) => {
    if (!richMode) {
      setMoney(prev => prev - amount);
    }
  };

  const incrementCombo = () => {
    setCombo(prev => {
      const newCount = prev.count + 1;
      const earnings = newCount;
      return {
        count: newCount,
        earnings: prev.earnings + earnings,
        isActive: true,
        timestamp: Date.now()
      };
    });
  };

  const resetCombo = () => {
    setCombo(prev => {
      if (prev.earnings > 0 && !richMode) {
        setMoney(money => money + prev.earnings);
      }
      return {
        count: 0,
        earnings: 0,
        isActive: false,
        timestamp: 0
      };
    });
  };

  const loseLife = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        handleGameOver();
      }
      return newLives;
    });
    resetCombo();
  };

  const addLife = () => {
    setLives(prev => prev + 1);
  };

  return {
    gameState,
    score,
    lives,
    money,
    combo,
    startGame,
    resetGame,
    togglePause,
    openShop,
    closeShop,
    addScore,
    addMoney,
    spendMoney,
    incrementCombo,
    resetCombo,
    loseLife,
    addLife
  };
};