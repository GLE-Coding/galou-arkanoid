import { GameObject, PaddleStats } from '../../types/game';
import { CANVAS_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED, PADDLE_WIDTH } from '../constants';
import { Missile } from './Missile';

export class Paddle implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  missiles: Missile[];
  stats: PaddleStats;
  lastMissileTime: number;

  constructor() {
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.x = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    this.y = 550;
    this.dx = 0;
    this.dy = 0;
    this.missiles = [];
    this.stats = {
      missileAmmo: 0,
      hasMissileLauncher: false
    };
    this.lastMissileTime = 0;
  }

  moveLeft() {
    this.dx = -PADDLE_SPEED;
  }

  moveRight() {
    this.dx = PADDLE_SPEED;
  }

  stop() {
    this.dx = 0;
  }

  update() {
    this.x += this.dx;
    if (this.x < 0) this.x = 0;
    if (this.x > CANVAS_WIDTH - PADDLE_WIDTH) this.x = CANVAS_WIDTH - PADDLE_WIDTH;

    // Update missiles
    this.missiles = this.missiles.filter(missile => !missile.isOutOfBounds());
    this.missiles.forEach(missile => missile.update());
  }

  setPosition(x: number) {
    this.x = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
  }

  fireMissile(damage: number) {
    const now = Date.now();
    if (this.stats.hasMissileLauncher && 
        this.stats.missileAmmo > 0 && 
        now - this.lastMissileTime >= 500) {
      const missile = new Missile(
        this.x + this.width / 2 - 2,
        this.y,
        damage
      );
      this.missiles.push(missile);
      this.lastMissileTime = now;
      this.stats.missileAmmo--;
      return true;
    }
    return false;
  }

  addMissileAmmo(amount: number = 1) {
    this.stats.missileAmmo += amount;
  }

  reset() {
    this.x = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    this.dx = 0;
    this.missiles = [];
    this.stats = {
      missileAmmo: 0,
      hasMissileLauncher: false
    };
    this.lastMissileTime = 0;
  }
}