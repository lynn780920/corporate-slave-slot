import * as PIXI from 'pixi.js';

/**
 * Screen FX Manager
 * Handles Canvas Screen Shake & Floating Win Popup Text
 */
export class Effects {
  constructor(app, stageContainer) {
    this.app = app;
    this.stageContainer = stageContainer;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;

    this.app.ticker.add(this.update, this);
  }

  triggerShake(intensity = 15, duration = 25) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  showFloatingWinText(x, y, text, color = '#fde047') {
    const textStyle = new PIXI.TextStyle({
      fontFamily: 'Cinzel, Outfit, sans-serif',
      fontSize: 32,
      fontWeight: 'bold',
      fill: [color, '#f59e0b'],
      stroke: '#000000',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 6,
      dropShadowDistance: 3
    });

    const pixiText = new PIXI.Text({ text, style: textStyle });
    pixiText.anchor.set(0.5);
    pixiText.x = x;
    pixiText.y = y;
    this.stageContainer.addChild(pixiText);

    let elapsed = 0;
    const animateText = () => {
      elapsed += 1;
      pixiText.y -= 1.5;
      pixiText.alpha = Math.max(0, 1 - elapsed / 45);

      if (elapsed >= 45) {
        this.app.ticker.remove(animateText);
        this.stageContainer.removeChild(pixiText);
        pixiText.destroy();
      }
    };

    this.app.ticker.add(animateText);
  }

  update() {
    if (this.shakeDuration > 0) {
      this.shakeDuration--;
      const dx = (Math.random() - 0.5) * this.shakeIntensity;
      const dy = (Math.random() - 0.5) * this.shakeIntensity;
      this.stageContainer.x = dx;
      this.stageContainer.y = dy;

      if (this.shakeDuration <= 0) {
        this.stageContainer.x = 0;
        this.stageContainer.y = 0;
      }
    }
  }
}
