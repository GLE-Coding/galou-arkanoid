import { GameObject, BallEffects } from '../../types/game';
import { BALL_RADIUS, BALL_SPEED, BASE_BALL_DAMAGE, PADDLE_WIDTH } from '../constants';

export class Ball implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  effects: BallEffects;

  constructor(paddleX: number, paddleY: number) {
    this.width = BALL_RADIUS * 2;
    this.height = BALL_RADIUS * 2;
    this.effects = this.getDefaultEffects();
    this.reset(paddleX, paddleY);
  }

  private getDefaultEffects(): BallEffects {
    return {
      speedMultiplier: 1,
      damageMultiplier: 1
    };
  }

  reset(paddleX: number, paddleY: number) {
    this.x = paddleX + PADDLE_WIDTH / 2 - BALL_RADIUS;
    this.y = paddleY - this.height - 2;
    this.dx = 0;
    this.dy = 0;
    this.effects = this.getDefaultEffects();
  }

  launch() {
    if (this.dx === 0 && this.dy === 0) {
      const speed = BALL_SPEED * this.effects.speedMultiplier;
      this.dx = speed;
      this.dy = -speed;
      return true;
    }
    return false;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  reverseX() {
    this.dx *= -1;
  }

  reverseY() {
    this.dy *= -1;
  }

  setVelocityFromPaddleHit(hitPosition: number) {
    const speed = BALL_SPEED * this.effects.speedMultiplier;
    this.dx = speed * (hitPosition - 0.5) * 2;
    this.dy = -speed;
  }

  getDamage() {
    return BASE_BALL_DAMAGE * this.effects.damageMultiplier;
  }

  getSpeed() {
    return BALL_SPEED * this.effects.speedMultiplier;
  }

  getBaseSpeed() {
    return BALL_SPEED;
  }

  getCollisionRadius() {
    return this.width / 2;
  }
}