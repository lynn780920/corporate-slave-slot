const PIXI = window.PIXI;

/**
 * PixiJS Particle System for Gates of Set
 * Handles symbol explosions, multiplier orb bursts, ambient torch embers, and golden coin showers.
 */
export class ParticleSystem {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.particles = [];

    this.particleTexture = this.createSparkleTexture();
    this.coinTexture = this.createCoinTexture();

    this.app.ticker.add(this.update, this);
  }

  createSparkleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(251, 191, 36, 0.9)');
    grad.addColorStop(1, 'rgba(245, 158, 11, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fill();

    return PIXI.Texture.from(canvas);
  }

  createCoinTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(16, 16, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(16, 14, 4, 0, Math.PI * 2);
    ctx.moveTo(16, 18);
    ctx.lineTo(16, 25);
    ctx.moveTo(12, 21);
    ctx.lineTo(20, 21);
    ctx.stroke();

    return PIXI.Texture.from(canvas);
  }

  spawnExplosion(x, y, color = 0xf59e0b, count = 25) {
    for (let i = 0; i < count; i++) {
      const sprite = new PIXI.Sprite(this.particleTexture);
      sprite.anchor.set(0.5);
      sprite.x = x;
      sprite.y = y;
      sprite.tint = color;
      
      const scale = 0.5 + Math.random() * 1.2;
      sprite.scale.set(scale, scale);

      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;

      this.container.addChild(sprite);

      this.particles.push({
        sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.25,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.03,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }
  }

  spawnCoinShower(count = 150) {
    const screenWidth = this.app.screen.width;
    for (let i = 0; i < count; i++) {
      const sprite = new PIXI.Sprite(this.coinTexture);
      sprite.anchor.set(0.5);
      sprite.x = Math.random() * screenWidth;
      sprite.y = -50 - Math.random() * 500;
      
      const scale = 0.6 + Math.random() * 0.6;
      sprite.scale.set(scale, scale);

      this.container.addChild(sprite);

      this.particles.push({
        sprite,
        vx: (Math.random() - 0.5) * 4,
        vy: 8 + Math.random() * 12,
        gravity: 0.2,
        alpha: 1,
        decay: 0.003,
        rotationSpeed: (Math.random() - 0.5) * 0.3
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.sprite.x += p.vx;
      p.sprite.y += p.vy;
      p.vy += p.gravity;
      p.sprite.rotation += p.rotationSpeed;
      p.alpha -= p.decay;
      p.sprite.alpha = Math.max(0, p.alpha);

      if (p.alpha <= 0 || p.sprite.y > this.app.screen.height + 100) {
        this.container.removeChild(p.sprite);
        p.sprite.destroy();
        this.particles.splice(i, 1);
      }
    }
  }
}
