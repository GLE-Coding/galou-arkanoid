import { useEffect } from 'react';
import { GameState } from '../types/game';
import { Ball } from '../game/entities/Ball';
import { Paddle } from '../game/entities/Paddle';
import { SoundManager } from '../game/SoundManager';

export const useGameControls = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  gameState: GameState,
  paddle: Paddle,
  ball: Ball,
  soundManager: SoundManager,
  onTogglePause: () => void,
  onEscapePress: () => void,
  onShopOpen: () => void
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (gameState === 'playing' || gameState === 'paused') {
        if (e.code === 'KeyP') {
          onTogglePause();
        } else if (e.code === 'Escape') {
          onEscapePress();
        }
      }

      if (gameState === 'playing') {
        if (e.code === 'KeyB') {
          onShopOpen();
        } else if (e.code === 'ArrowLeft') {
          paddle.moveLeft();
        } else if (e.code === 'ArrowRight') {
          paddle.moveRight();
        } else if (e.code === 'Space') {
          e.preventDefault();
          await soundManager.initializeAudio();
          if (ball.launch()) {
            soundManager.play('hit');
          }
        } else if (e.code === 'KeyE') {
          if (paddle.fireMissile(ball.getDamage())) {
            soundManager.play('missile');
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (
          (e.code === 'ArrowLeft' && paddle.dx < 0) ||
          (e.code === 'ArrowRight' && paddle.dx > 0)
        ) {
          paddle.stop();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gameState === 'playing') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        paddle.setPosition(x);
      }
    };

    const handleClick = async () => {
      if (gameState === 'playing') {
        await soundManager.initializeAudio();
        if (ball.launch()) {
          soundManager.play('hit');
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, paddle, ball, soundManager, onTogglePause, onEscapePress, onShopOpen, canvasRef]);
};