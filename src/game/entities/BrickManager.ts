import { Brick } from '../../types/game';
import { BRICK_COLORS, BRICK_HEIGHT, BRICK_WIDTH, BASE_BRICK_HEALTH } from '../constants';
import { Renderer } from '../Renderer';

export class BrickManager {
  bricks: Brick[];
  private renderer: Renderer | null = null;
  private level: number = 1;

  constructor() {
    this.bricks = [];
    this.init();
  }

  setRenderer(renderer: Renderer) {
    this.renderer = renderer;
  }

  init() {
    this.bricks = [];
    const healthMultiplier = Math.pow(1.2, this.level - 1);

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        const baseStrength = Math.ceil(BASE_BRICK_HEALTH * healthMultiplier);
        const strength = baseStrength + (4 - row);
        
        this.bricks.push({
          x: col * (BRICK_WIDTH + 5) + 35,
          y: row * (BRICK_HEIGHT + 5) + 50,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: BRICK_COLORS[row],
          strength,
          maxStrength: strength
        });
      }
    }
  }

  nextLevel() {
    this.level++;
    this.init();
  }

  checkCollision(ball: { x: number; y: number; width: number; height: number; getDamage: () => number }) {
    let collided = false;
    this.bricks = this.bricks.filter(brick => {
      if (
        ball.x + ball.width >= brick.x &&
        ball.x <= brick.x + brick.width &&
        ball.y + ball.height >= brick.y &&
        ball.y <= brick.y + brick.height
      ) {
        brick.strength -= ball.getDamage();
        collided = true;

        if (brick.strength <= 0 && this.renderer) {
          this.renderer.createExplosion(
            brick.x + brick.width / 2,
            brick.y + brick.height / 2,
            brick.color
          );
        }

        return brick.strength > 0;
      }
      return true;
    });
    return collided;
  }

  getCurrentLevel() {
    return this.level;
  }
}