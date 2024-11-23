import { MISSILE_SPEED, MISSILE_WIDTH, MISSILE_HEIGHT } from '../constants';

export class Missile {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
  damage: number;
  destroyed: boolean;

  constructor(x: number, y: number, damage: number) {
    this.x = x;
    this.y = y;
    this.width = MISSILE_WIDTH;
    this.height = MISSILE_HEIGHT;
    this.dy = -MISSILE_SPEED;
    this.damage = 1; // Set to 1 to match ball's base damage
    this.destroyed = false;
  }

  update() {
    this.y += this.dy;
  }

  isOutOfBounds() {
    return this.y + this.height < 0;
  }

  destroy() {
    this.destroyed = true;
  }
}