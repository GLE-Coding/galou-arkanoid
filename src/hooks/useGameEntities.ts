import { useCallback, useRef } from 'react';
import { Ball } from '../game/entities/Ball';
import { Paddle } from '../game/entities/Paddle';
import { BrickManager } from '../game/entities/BrickManager';
import { Renderer } from '../game/Renderer';
import { SoundManager } from '../game/SoundManager';

export const useGameEntities = () => {
  const paddleRef = useRef<Paddle>(new Paddle());
  const ballRef = useRef<Ball>(new Ball(paddleRef.current.x, paddleRef.current.y));
  const brickManagerRef = useRef<BrickManager>(new BrickManager());
  const rendererRef = useRef<Renderer | null>(null);
  const soundManagerRef = useRef<SoundManager>(new SoundManager());

  const initializeRenderer = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!rendererRef.current) {
      rendererRef.current = new Renderer(ctx);
      brickManagerRef.current.setRenderer(rendererRef.current);
    }
  }, []);

  const resetEntities = () => {
    paddleRef.current.reset();
    ballRef.current.reset(paddleRef.current.x, paddleRef.current.y);
    brickManagerRef.current.init();
  };

  return {
    paddleRef,
    ballRef,
    brickManagerRef,
    rendererRef,
    soundManagerRef,
    resetEntities,
    initializeRenderer
  };
};