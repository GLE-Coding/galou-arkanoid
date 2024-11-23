export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 15;
export const BALL_RADIUS = 8;
export const BRICK_WIDTH = 70;
export const BRICK_HEIGHT = 25;
export const BALL_SPEED = 7;
export const PADDLE_SPEED = 8;
export const BASE_BRICK_HEALTH = 3;
export const BASE_BALL_DAMAGE = 1;
export const MISSILE_SPEED = 7;
export const MISSILE_WIDTH = 4;
export const MISSILE_HEIGHT = 12;
export const MISSILE_AMMO_PER_UPGRADE = 3;

export const BRICK_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

export const SOUND_URLS = {
  hit: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',
  break: 'https://assets.mixkit.co/active_storage/sfx/2648/2648-preview.mp3',
  lose: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7c20f9c798.mp3',
  purchase: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  missile: 'https://assets.mixkit.co/active_storage/sfx/2771/2771-preview.mp3'
};

export const UPGRADES = [
  {
    id: 'extra-life',
    name: 'Extra Life',
    description: 'Adds one additional life',
    cost: 1000,
    effect: null
  },
  {
    id: 'slow-ball',
    name: 'Slow Ball',
    description: 'Reduces ball speed by 25%',
    cost: 500,
    effect: (ball: any) => {
      ball.effects.speedMultiplier *= 0.75;
    }
  },
  {
    id: 'speed-boost',
    name: 'Speed Boost',
    description: 'Increases ball speed by 15%',
    cost: 100,
    effect: (ball: any) => {
      ball.effects.speedMultiplier *= 1.15;
    }
  },
  {
    id: 'damage-boost',
    name: 'Damage Boost',
    description: 'Increases ball damage by 1',
    cost: 1000,
    effect: (ball: any) => {
      ball.effects.damageMultiplier += 1;
    }
  },
  {
    id: 'missile-launcher',
    name: 'Missile Launcher',
    description: `Adds missile launcher with ${MISSILE_AMMO_PER_UPGRADE} ammo`,
    cost: 2000,
    effect: (_ball: any, paddle: any) => {
      if (paddle) {
        paddle.stats.hasMissileLauncher = true;
        paddle.addMissileAmmo(MISSILE_AMMO_PER_UPGRADE);
      }
    }
  }
];