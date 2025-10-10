/**
 * Particle Class
 * Handles explosion particle effects
 */

export class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4; // Random horizontal velocity
    this.vy = (Math.random() - 0.5) * 4; // Random vertical velocity
    this.life = 30; // Frames remaining
    this.maxLife = 30;
    this.size = Math.random() * 6 + 2; // Random size
    this.color = `hsl(${Math.random() * 60}, 100%, 50%)`; // Random warm color
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1;
  }

  isDead() {
    return this.life <= 0;
  }
}
