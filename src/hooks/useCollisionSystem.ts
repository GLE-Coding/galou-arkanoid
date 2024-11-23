import { CANVAS_HEIGHT } from '../game/constants';
import { Ball } from '../game/entities/Ball';
import { Paddle } from '../game/entities/Paddle';
import { BrickManager } from '../game/entities/BrickManager';
import { SoundManager } from '../game/SoundManager';
import { Renderer } from '../game/Renderer';

export const useCollisionSystem = (
  addScore: (points: number) => void,
  addMoney: (amount: number) => void,
  loseLife: () => void,
  openShop: () => void,
  incrementCombo: () => void,
  resetCombo: () => void,
  currentComboCount: number
) => {
  const handleCollisions = (
    ball: Ball,
    paddle: Paddle,
    brickManager: BrickManager,
    soundManager: SoundManager,
    renderer: Renderer
  ) => {
    // Wall collisions
    if (ball.x <= 0 || ball.x >= 800 - ball.width) ball.reverseX();
    if (ball.y <= 0) ball.reverseY();

    // Paddle collision
    if (
      ball.y + ball.height >= paddle.y &&
      ball.y <= paddle.y + paddle.height &&
      ball.x + ball.width >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      const hitPos = (ball.x + ball.width / 2 - paddle.x) / paddle.width;
      ball.setVelocityFromPaddleHit(hitPos);
      soundManager.play('hit');
      resetCombo();
    }

    // Missile collisions with damage equal to ball
    paddle.missiles = paddle.missiles.filter(missile => {
      if (brickManager.checkCollision({ ...missile, getDamage: () => ball.getDamage() })) {
        soundManager.play('break');
        addScore(100);
        missile.damage--;
        const damageDealt = ball.getDamage(); // Use ball damage instead of missile damage
        const baseMoney = Math.ceil(damageDealt * 1);
        const comboMultiplier = currentComboCount >= 1 ? currentComboCount : 1;
        const totalMoney = baseMoney * comboMultiplier;
        
        if (missile.damage <= 0) {
          renderer.createExplosion(
            missile.x + missile.width / 2,
            missile.y + missile.height / 2,
            '#FF4444',
            true
          );
          soundManager.play('missile');
          missile.destroy();
        }
        
        addMoney(totalMoney);
        
        if (currentComboCount >= 2) {
          incrementCombo();
        } else {
          incrementCombo();
        }
      }
      return !missile.destroyed && !missile.isOutOfBounds();
    });

    // Brick collision
    if (brickManager.checkCollision(ball)) {
      ball.reverseY();
      addScore(100);
      
      const damageDealt = ball.getDamage();
      const baseMoney = Math.ceil(damageDealt * 1);
      const comboMultiplier = currentComboCount >= 1 ? currentComboCount : 1;
      const totalMoney = baseMoney * comboMultiplier;
      
      addMoney(totalMoney);
      
      if (currentComboCount >= 2) {
        incrementCombo();
      } else {
        incrementCombo();
      }
      
      soundManager.play('break');
    }

    // Ball out of bounds
    if (ball.y >= CANVAS_HEIGHT) {
      loseLife();
      soundManager.play('lose');
      ball.reset(paddle.x, paddle.y);
      resetCombo();
    }

    // Level complete - open shop
    if (brickManager.bricks.length === 0) {
      addScore(1000);
      const levelCompletionBonus = 500;
      addMoney(levelCompletionBonus);
      brickManager.nextLevel();
      ball.reset(paddle.x, paddle.y);
      openShop();
      resetCombo();
    }
  };

  return { handleCollisions };
};