import { useEffect, useRef } from 'react';
import { GameState } from '../types/game';
import { Ball } from '../game/entities/Ball';
import { Paddle } from '../game/entities/Paddle';
import { BrickManager } from '../game/entities/BrickManager';
import { Renderer } from '../game/Renderer';
import { SoundManager } from '../game/SoundManager';

export const useGameLoop = (
  gameState: GameState,
  ball: Ball,
  paddle: Paddle,
  brickManager: BrickManager,
  renderer: Renderer | null,
  handleCollisions: (
    ball: Ball,
    paddle: Paddle,
    brickManager: BrickManager,
    soundManager: SoundManager,
    renderer: Renderer
  ) => void,
  soundManager: SoundManager
) => {
  const frameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const targetFPSRef = useRef(60);
  const frameIntervalRef = useRef(1000 / 60);

  useEffect(() => {
    const update = (timestamp: number) => {
      if (!renderer) return;

      // Calculate time delta
      const elapsed = timestamp - lastUpdateRef.current;

      // Only update if enough time has passed
      if (elapsed >= frameIntervalRef.current) {
        // Adjust target FPS based on device performance
        if (elapsed > frameIntervalRef.current * 1.2) {
          targetFPSRef.current = Math.max(30, targetFPSRef.current - 1);
        } else if (elapsed < frameIntervalRef.current * 0.8) {
          targetFPSRef.current = Math.min(60, targetFPSRef.current + 1);
        }
        frameIntervalRef.current = 1000 / targetFPSRef.current;

        lastUpdateRef.current = timestamp - (elapsed % frameIntervalRef.current);

        renderer.clear();

        if (gameState === 'playing') {
          paddle.update();

          if (ball.dx !== 0 || ball.dy !== 0) {
            ball.update();
            handleCollisions(ball, paddle, brickManager, soundManager, renderer);
          } else {
            ball.x = paddle.x + paddle.width / 2 - ball.width / 2;
            ball.y = paddle.y - ball.height;
          }
        }

        renderer.drawBricks(brickManager);
        renderer.drawPaddle(paddle);
        renderer.drawBall(ball);

        if (gameState === 'playing' && ball.dx === 0 && ball.dy === 0) {
          renderer.drawLaunchMessage();
        }

        renderer.commit();
      }

      frameRef.current = requestAnimationFrame(update);
    };

    if (renderer) {
      frameRef.current = requestAnimationFrame(update);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameState, ball, paddle, brickManager, renderer, handleCollisions, soundManager]);
};