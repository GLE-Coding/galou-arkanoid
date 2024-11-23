export type GameState = 'menu' | 'playing' | 'paused' | 'gameover' | 'shop';

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
}

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strength: number;
  maxStrength: number;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: (ball: Ball, paddle: Paddle) => void;
}

export interface BallEffects {
  speedMultiplier: number;
  damageMultiplier: number;
}

export interface PaddleStats {
  missileAmmo: number;
  hasMissileLauncher: boolean;
}

export interface ComboState {
  count: number;
  earnings: number;
  isActive: boolean;
  timestamp: number;
}