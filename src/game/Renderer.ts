import { BrickManager } from './entities/BrickManager';
import { Particle } from './entities/Particle';
import { Missile } from './entities/Missile';
import { Paddle } from './entities/Paddle';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[];
  private lastFrameTime: number;
  private frameCount: number;
  private fps: number;
  private offscreenCanvas: OffscreenCanvas;
  private offscreenCtx: OffscreenCanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.particles = [];
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;

    // Create offscreen canvas for double buffering
    this.offscreenCanvas = new OffscreenCanvas(800, 600);
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', {
      alpha: false,
      willReadFrequently: false
    }) as OffscreenCanvasRenderingContext2D;

    // Optimize main canvas context
    this.ctx.imageSmoothingEnabled = false;
    
    // Enable hardware acceleration
    (this.ctx.canvas as HTMLCanvasElement).style.transform = 'translateZ(0)';
  }

  clear() {
    this.offscreenCtx.fillStyle = '#1F2937'; // bg-gray-800
    this.offscreenCtx.fillRect(0, 0, 800, 600);
  }

  drawBricks(brickManager: BrickManager) {
    const ctx = this.offscreenCtx;
    brickManager.bricks.forEach(brick => {
      // Draw brick shadow (optimized)
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(brick.x + 2, brick.y + 2, brick.width, brick.height);

      // Calculate health percentage for color intensity
      const healthPercent = brick.strength / brick.maxStrength;
      const alpha = 0.3 + (0.7 * healthPercent);
      ctx.fillStyle = brick.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

      // Batch text rendering
      if (brick.strength > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          Math.ceil(brick.strength).toString(),
          brick.x + brick.width / 2,
          brick.y + brick.height / 2
        );
      }
    });

    // Update and draw particles in batch
    const remainingParticles: Particle[] = [];
    ctx.save();
    for (const particle of this.particles) {
      particle.update();
      if (particle.life > 0) {
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        remainingParticles.push(particle);
      }
    }
    ctx.restore();
    this.particles = remainingParticles;
  }

  drawPaddle(paddle: Paddle) {
    const ctx = this.offscreenCtx;
    
    // Draw paddle base with gradient (cached if possible)
    const gradient = ctx.createLinearGradient(
      paddle.x,
      paddle.y,
      paddle.x,
      paddle.y + paddle.height
    );
    gradient.addColorStop(0, '#9F7AEA');
    gradient.addColorStop(1, '#805AD5');
    ctx.fillStyle = gradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Draw missile launcher if equipped
    if (paddle.stats.hasMissileLauncher) {
      ctx.fillStyle = '#4A5568';
      ctx.fillRect(
        paddle.x + paddle.width / 2 - 6,
        paddle.y - 8,
        12,
        8
      );
    }

    // Batch draw missiles
    paddle.missiles.forEach(missile => {
      this.drawMissile(missile);
    });
  }

  drawMissile(missile: Missile) {
    const ctx = this.offscreenCtx;
    ctx.fillStyle = '#F56565';
    ctx.fillRect(missile.x, missile.y, missile.width, missile.height);
  }

  drawBall(ball: { x: number; y: number; width: number; height: number }) {
    const ctx = this.offscreenCtx;
    ctx.fillStyle = '#F7FAFC';
    ctx.beginPath();
    ctx.arc(
      ball.x + ball.width / 2,
      ball.y + ball.height / 2,
      ball.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  drawLaunchMessage() {
    const ctx = this.offscreenCtx;
    ctx.fillStyle = '#9F7AEA';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE to launch', 400, 300);
  }

  createExplosion(x: number, y: number, color: string, isLarge: boolean = false) {
    // Limit max particles based on device performance
    const particleCount = isLarge ? 12 : 6;
    const speedMultiplier = isLarge ? 1.5 : 1;
    const colors = isLarge ? 
      ['#FF4444', '#FF7777', '#FFAA44', '#FFDD44'] : 
      [color];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = (2 + Math.random() * 2) * speedMultiplier;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(new Particle(x, y, dx, dy, randomColor, isLarge));
    }
  }

  // Commit the offscreen canvas to the main canvas
  commit() {
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    
    // Calculate FPS
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.frameCount++;
    
    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastFrameTime = now;
    }
  }
}