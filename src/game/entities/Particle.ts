export class Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;

  constructor(x: number, y: number, dx: number, dy: number, color: string, isLarge: boolean = false) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = isLarge ? 3 : 2;
    this.color = color;
    this.maxLife = isLarge ? 90 : 60;
    this.life = this.maxLife;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += 0.1; // Add gravity effect
    this.dx *= 0.99; // Add air resistance
    this.life--;
  }
}