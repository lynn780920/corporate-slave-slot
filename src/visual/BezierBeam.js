const PIXI = window.PIXI;

/**
 * Bezier Light Beam Trajectory FX for Multiplier Orbs
 * Renders glowing Bezier curve energy beam shooting from orb to total multiplier counter.
 */
export class BezierBeam {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.activeBeams = [];
    this.app.ticker.add(this.update, this);
  }

  fireBeam(startX, startY, endX, endY, color = 0xf59e0b, onComplete = null) {
    const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 150;
    const midY = Math.min(startY, endY) - 150 - Math.random() * 100;

    const graphics = new PIXI.Graphics();
    this.container.addChild(graphics);

    const headCanvas = document.createElement('canvas');
    headCanvas.width = 32;
    headCanvas.height = 32;
    const ctx = headCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#fde047');
    grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const headTexture = PIXI.Texture.from(headCanvas);
    const headSprite = new PIXI.Sprite(headTexture);
    headSprite.anchor.set(0.5);
    this.container.addChild(headSprite);

    this.activeBeams.push({
      graphics,
      headSprite,
      startX, startY,
      midX, midY,
      endX, endY,
      progress: 0,
      speed: 0.025,
      color,
      onComplete
    });
  }

  getQuadraticBezierPoint(t, p0, p1, p2) {
    const oneMinusT = 1 - t;
    return {
      x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
      y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y
    };
  }

  update() {
    for (let i = this.activeBeams.length - 1; i >= 0; i--) {
      const b = this.activeBeams[i];
      b.progress += b.speed;

      if (b.progress >= 1) {
        b.progress = 1;
        if (b.onComplete) b.onComplete();
        
        this.container.removeChild(b.graphics);
        this.container.removeChild(b.headSprite);
        b.graphics.destroy();
        b.headSprite.destroy();
        this.activeBeams.splice(i, 1);
        continue;
      }

      b.graphics.clear();
      
      const steps = 30;
      const currentSteps = Math.floor(steps * b.progress);

      const p0 = { x: b.startX, y: b.startY };
      const p1 = { x: b.midX, y: b.midY };
      const p2 = { x: b.endX, y: b.endY };

      if (currentSteps > 1) {
        // Outer Glow
        b.graphics.lineStyle(12, b.color, 0.35);
        let pt0 = this.getQuadraticBezierPoint(0, p0, p1, p2);
        b.graphics.moveTo(pt0.x, pt0.y);
        for (let s = 1; s <= currentSteps; s++) {
          const t = (s / steps) * b.progress;
          const pt = this.getQuadraticBezierPoint(t, p0, p1, p2);
          b.graphics.lineTo(pt.x, pt.y);
        }

        // Inner Core Light
        b.graphics.lineStyle(4, 0xffffff, 0.9);
        b.graphics.moveTo(pt0.x, pt0.y);
        for (let s = 1; s <= currentSteps; s++) {
          const t = (s / steps) * b.progress;
          const pt = this.getQuadraticBezierPoint(t, p0, p1, p2);
          b.graphics.lineTo(pt.x, pt.y);
        }
      }

      const currentPt = this.getQuadraticBezierPoint(b.progress, p0, p1, p2);
      b.headSprite.x = currentPt.x;
      b.headSprite.y = currentPt.y;
    }
  }
}
