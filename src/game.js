import './index.css';
import { SlotEngine, SYMBOLS } from './logic/SlotEngine.js';
import { soundManager } from './logic/SoundManager.js';
import { UIManager } from './ui/UIManager.js';

function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  else return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

class GameApp {
  constructor() {
    this.engine = new SlotEngine();
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.fsCanvas = document.getElementById('fullscreen-bigwin-canvas');
    this.fsCtx = this.fsCanvas ? this.fsCanvas.getContext('2d') : null;

    this.cols = 6;
    this.rows = 5;
    this.cellSize = 94;
    this.cellGap = 10;
    this.gridWidth = this.cols * (this.cellSize + this.cellGap) + this.cellGap;
    this.gridHeight = this.rows * (this.cellSize + this.cellGap) + this.cellGap;

    if (this.canvas) {
      this.canvas.width = this.gridWidth;
      this.canvas.height = this.gridHeight;
    }

    this.isSpinning = false;
    this.loadedImages = {};
    this.preloadAssets();

    // Visual FX States
    this.particles = [];
    this.ambientEmbers = [];
    this.laserBeams = [];
    this.floatingTexts = [];
    this.cellShockwaves = [];
    this.headerExplosions = [];
    this.fsCoins = [];

    this.bigWinMode = false;
    this.bigWinTarget = 0;
    this.bigWinCurrent = 0;
    this.sunburstAngle = 0;

    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.globalTime = 0;

    this.cellStates = Array.from({ length: 6 }, () => 
      Array.from({ length: 5 }, () => ({
        offsetY: 0, scale: 1, alpha: 1, glow: 0, rotation: 0
      }))
    );

    for (let i = 0; i < 50; i++) {
      this.ambientEmbers.push({
        x: Math.random() * this.gridWidth,
        y: Math.random() * this.gridHeight,
        vy: -0.8 - Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.8,
        size: 1.5 + Math.random() * 3.5,
        alpha: 0.2 + Math.random() * 0.7,
        color: Math.random() < 0.5 ? '#f59e0b' : '#fde047'
      });
    }

    this.uiManager = new UIManager(
      this.engine,
      () => this.onSpinClicked(),
      () => this.onBuyFeatureClicked()
    );

    this.onResize();
    window.addEventListener('resize', () => this.onResize());

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.renderLoop(t));
  }

  preloadAssets() {
    const assetList = [
      'eye', 'scepter', 'bow', 'sword', 
      'gem_orange', 'gem_red', 'gem_purple', 'gem_blue', 'gem_green',
      'scatter', 'god_male', 'god_female', 'multiplier', 'bg_gods'
    ];

    assetList.forEach(name => {
      const img = new Image();
      img.src = `/assets/${name}.png`;
      img.onload = () => {
        this.loadedImages[name] = img;
      };
    });
  }

  onResize() {
    if (this.canvas && this.canvas.parentElement) {
      const parentWidth = this.canvas.parentElement.clientWidth;
      const maxW = Math.max(300, Math.min(640, parentWidth - 20));
      const scale = maxW / this.gridWidth;

      this.canvas.style.width = `${Math.floor(this.gridWidth * scale)}px`;
      this.canvas.style.height = `${Math.floor(this.gridHeight * scale)}px`;
    }

    if (this.fsCanvas) {
      this.fsCanvas.width = window.innerWidth;
      this.fsCanvas.height = window.innerHeight;
    }
  }

  // Spectacular Symbol Elimination Sparkle Nova Burst
  spawnExplosion(x, y, color = '#fde047', count = 40) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 11;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() < 0.6 ? color : '#ffffff',
        size: 3 + Math.random() * 7,
        alpha: 1,
        decay: 0.018 + Math.random() * 0.02
      });
    }

    // Double Ring Shockwave
    this.cellShockwaves.push({
      x, y,
      radius: 10,
      maxRadius: 90,
      alpha: 1,
      color: '#f59e0b',
      width: 6
    });
    this.cellShockwaves.push({
      x, y,
      radius: 5,
      maxRadius: 60,
      alpha: 1,
      color: '#ffffff',
      width: 3
    });
  }

  spawnFloatingText(x, y, text) {
    this.floatingTexts.push({
      x, y,
      text,
      alpha: 1,
      decay: 0.012,
      scale: 1.6
    });
  }

  // Super Cool Multiplier Orb Laser Beam FX
  spawnMultiplierLaserBeam(startX, startY, endX, endY, multVal) {
    const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 160;
    const midY = Math.min(startY, endY) - 150;
    this.laserBeams.push({
      startX, startY, midX, midY, endX, endY,
      progress: 0,
      speed: 0.022,
      multVal
    });
  }

  triggerShake(intensity = 18, durationFrames = 25) {
    let frame = 0;
    const shakeInterval = () => {
      if (frame < durationFrames) {
        this.shakeOffsetX = (Math.random() - 0.5) * intensity;
        this.shakeOffsetY = (Math.random() - 0.5) * intensity;
        frame++;
        requestAnimationFrame(shakeInterval);
      } else {
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
      }
    };
    shakeInterval();
  }

  triggerFullscreenBigWin(winAmount) {
    this.bigWinMode = true;
    this.bigWinTarget = winAmount;
    this.bigWinCurrent = 0;
    this.fsCoins = [];

    this.uiManager.showBigWinModal(winAmount);

    const sw = window.innerWidth;
    const sh = window.innerHeight;

    for (let i = 0; i < 600; i++) {
      this.fsCoins.push({
        x: Math.random() * sw,
        y: -50 - Math.random() * 800,
        vx: (Math.random() - 0.5) * 5,
        vy: 6 + Math.random() * 14,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        size: 10 + Math.random() * 16,
        alpha: 1,
        color: Math.random() < 0.75 ? '#f59e0b' : '#fde047'
      });
    }

    this.triggerShake(25, 45);

    return new Promise((resolve) => {
      const durationMs = 3200;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        this.bigWinCurrent = this.bigWinTarget * progress;

        const elAmount = document.getElementById('fs-bigwin-amount');
        if (elAmount) {
          elAmount.textContent = `$${this.bigWinCurrent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          this.bigWinCurrent = this.bigWinTarget;
          if (elAmount) {
            elAmount.textContent = `$${this.bigWinTarget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  renderLoop(timestamp) {
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.globalTime += 0.03;
    this.sunburstAngle += 0.012;

    if (this.ctx) {
      this.drawMainScene();
    }
    if (this.fsCtx && this.bigWinMode) {
      this.drawFullscreenBigWinScene();
    }

    requestAnimationFrame((t) => this.renderLoop(t));
  }

  drawMainScene() {
    const ctx = this.ctx;
    const w = this.gridWidth;
    const h = this.gridHeight;

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.translate(this.shakeOffsetX, this.shakeOffsetY);

    if (this.loadedImages['bg_gods']) {
      ctx.drawImage(this.loadedImages['bg_gods'], 0, 0, w, h);
    } else {
      ctx.fillStyle = '#07050b';
      ctx.fillRect(0, 0, w, h);
    }

    // Ambient Torch Embers
    for (let i = 0; i < this.ambientEmbers.length; i++) {
      const p = this.ambientEmbers[i];
      p.y += p.vy;
      p.x += Math.sin(this.globalTime + i) * 0.6;
      if (p.y < 0) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Ornate Gold Border Frame
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.strokeRect(3, 3, w - 6, h - 6);
    ctx.shadowBlur = 0;

    // 6x5 Grid Cells & Symbols
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const x = c * (this.cellSize + this.cellGap) + this.cellGap;
        const y = r * (this.cellSize + this.cellGap) + this.cellGap;
        const state = this.cellStates[c][r];

        ctx.fillStyle = 'rgba(18, 13, 28, 0.85)';
        ctx.strokeStyle = state.glow > 0 ? '#fde047' : 'rgba(59, 45, 84, 0.6)';
        ctx.lineWidth = state.glow > 0 ? 3 : 2;

        if (state.glow > 0) {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 16 * state.glow;
        }

        this.drawRoundedRect(ctx, x, y, this.cellSize, this.cellSize, 12);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        const sym = this.engine.grid[c][r];
        if (sym && state.alpha > 0) {
          const centerX = x + this.cellSize / 2;
          const centerY = y + this.cellSize / 2 + state.offsetY;

          ctx.save();
          ctx.translate(centerX, centerY);

          // Multiplier Orb Electric Charge Pulse Effect
          if (sym.type === SYMBOLS.MULTIPLIER) {
            const orbPulseScale = 1.0 + Math.sin(this.globalTime * 6) * 0.12;
            ctx.scale(state.scale * orbPulseScale, state.scale * orbPulseScale);

            // Glowing Outer Ring Aura
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(0, 0, (this.cellSize * 0.85) / 2 + 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          } else {
            ctx.scale(state.scale, state.scale);
          }

          ctx.rotate(state.rotation);
          ctx.globalAlpha = state.alpha;

          const img = this.loadedImages[sym.type];
          if (img) {
            const drawSize = this.cellSize * 0.85;
            ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
          }

          if (sym.type === SYMBOLS.MULTIPLIER) {
            ctx.font = 'black 22px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeText(`${sym.multiplierVal}x`, 0, 0);
            ctx.fillText(`${sym.multiplierVal}x`, 0, 0);
          }

          ctx.restore();
        }
      }
    }

    // Cell Elimination Shockwaves
    for (let i = this.cellShockwaves.length - 1; i >= 0; i--) {
      const sw = this.cellShockwaves[i];
      sw.radius += 5;
      sw.alpha -= 0.04;

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        this.cellShockwaves.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = sw.alpha;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = sw.width;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Glowing Spiral Bezier Multiplier Laser Beams
    for (let i = this.laserBeams.length - 1; i >= 0; i--) {
      const b = this.laserBeams[i];
      b.progress += b.speed;
      if (b.progress >= 1) {
        // Trigger Header Pulsate Effect & Shockwave Explosion
        const headerBox = document.getElementById('ui-multiplier-box');
        if (headerBox) {
          headerBox.classList.add('scale-150', 'border-yellow-300', 'shadow-2xl');
          setTimeout(() => headerBox.classList.remove('scale-150', 'border-yellow-300', 'shadow-2xl'), 350);
        }
        this.laserBeams.splice(i, 1);
        continue;
      }

      const p0 = { x: b.startX, y: b.startY };
      const p1 = { x: b.midX, y: b.midY };
      const p2 = { x: b.endX, y: b.endY };

      const t = b.progress;
      const currX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      const currY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

      // Outer Thick Energy Laser
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.lineWidth = 12;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(p1.x, p1.y, currX, currY);
      ctx.stroke();

      // Inner Core White Laser
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Leading Head Light Orb
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(currX, currY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbiting Laser Particle Sparkles
      for (let k = 0; k < 2; k++) {
        this.particles.push({
          x: currX + (Math.random() - 0.5) * 12,
          y: currY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          color: Math.random() < 0.5 ? '#fde047' : '#ffffff',
          size: 3 + Math.random() * 4,
          alpha: 1,
          decay: 0.06
        });
      }
    }

    // Sparkles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Floating Score Numbers
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 1.6;
      ft.alpha -= ft.decay;
      ft.scale = Math.max(1, ft.scale - 0.015);

      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.font = `black ${Math.floor(30 * ft.scale)}px Outfit, Cinzel, sans-serif`;
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 15;
      ctx.textAlign = 'center';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }

  drawFullscreenBigWinScene() {
    const ctx = this.fsCtx;
    const w = this.fsCanvas.width;
    const h = this.fsCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Rotating Sunburst Light Rays
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.sunburstAngle);
    const numRays = 20;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    const rayLength = Math.max(w, h) * 1.5;
    for (let i = 0; i < numRays; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, rayLength, (i * 2 * Math.PI) / numRays, ((i * 2 + 1) * Math.PI) / numRays);
      ctx.lineTo(0, 0);
      ctx.fill();
    }
    ctx.restore();

    // Raining 3D Coins
    for (let i = 0; i < this.fsCoins.length; i++) {
      const coin = this.fsCoins[i];
      coin.y += coin.vy;
      coin.x += coin.vx;
      coin.rotation += coin.rotSpeed;

      if (coin.y > h + 50) {
        coin.y = -30;
        coin.x = Math.random() * w;
      }

      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.rotation);
      ctx.fillStyle = coin.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, coin.size, coin.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  async onSpinClicked() {
    if (this.isSpinning) return;

    try {
      const bet = this.engine.getBet();
      if (this.engine.balance < bet && !this.engine.isFreeSpins) {
        alert('餘額不足！');
        this.engine.autoSpinCount = 0;
        this.uiManager.updateDisplay();
        return;
      }

      this.isSpinning = true;
      this.uiManager.setControlsLock(true);

      if (!this.engine.isFreeSpins) {
        this.engine.balance -= bet;
        this.uiManager.setWinAmount(0);
        this.uiManager.setMultiplierDisplay(1);
      } else {
        this.engine.freeSpinsRemaining--;
      }

      this.uiManager.updateDisplay();
      soundManager.playSpin();

      this.engine.generateSpinGrid(false);

      await this.animateStaggeredDrop();
      await this.runTurnLoop();
    } catch (err) {
      console.error('Spin Execution Error:', err);
    } finally {
      this.isSpinning = false;
      this.uiManager.setControlsLock(false);
    }

    if (this.engine.isFreeSpins && this.engine.freeSpinsRemaining > 0) {
      setTimeout(() => this.onSpinClicked(), this.engine.turbo ? 150 : 500);
    } else if (this.engine.isFreeSpins && this.engine.freeSpinsRemaining <= 0) {
      this.engine.isFreeSpins = false;
      await this.triggerFullscreenBigWin(this.engine.totalFreeSpinsWin);
      this.uiManager.updateDisplay();
    } else if (this.engine.autoSpinCount > 0) {
      this.engine.autoSpinCount--;
      this.uiManager.updateAutoSpinDisplay();
      if (this.engine.autoSpinCount > 0) {
        setTimeout(() => this.onSpinClicked(), this.engine.turbo ? 150 : 500);
      }
    }
  }

  async onBuyFeatureClicked() {
    if (this.isSpinning) return;

    try {
      const cost = this.engine.getBet() * 100;
      if (this.engine.balance < cost) {
        alert('餘額不足以購買免費遊戲！');
        return;
      }

      this.isSpinning = true;
      this.uiManager.setControlsLock(true);
      this.engine.balance -= cost;
      this.uiManager.updateDisplay();
      soundManager.playFreeSpinTrigger();

      this.engine.generateSpinGrid(true);

      await this.animateStaggeredDrop();
      await this.runTurnLoop();
    } catch (err) {
      console.error('Buy Feature Error:', err);
    } finally {
      this.isSpinning = false;
      this.uiManager.setControlsLock(false);
    }
  }

  animateStaggeredDrop() {
    const colStaggerMs = this.engine.turbo ? 20 : 45;
    const colDurationMs = this.engine.turbo ? 140 : 320;
    const totalDuration = this.cols * colStaggerMs + colDurationMs;
    const startTime = performance.now();

    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        this.cellStates[c][r].offsetY = -120 - r * 40;
        this.cellStates[c][r].scale = 1;
        this.cellStates[c][r].alpha = 1;
        this.cellStates[c][r].glow = 0;
      }
    }

    return new Promise((resolve) => {
      const animateStep = (now) => {
        const elapsed = now - startTime;

        for (let c = 0; c < this.cols; c++) {
          const colDelay = c * colStaggerMs;
          if (elapsed >= colDelay) {
            const colProgress = Math.min(1, (elapsed - colDelay) / colDurationMs);
            const bounceProgress = easeOutBounce(colProgress);

            for (let r = 0; r < this.rows; r++) {
              const initialOffset = -120 - r * 40;
              this.cellStates[c][r].offsetY = initialOffset * (1 - bounceProgress);
            }
          }
        }

        if (elapsed < totalDuration) {
          requestAnimationFrame(animateStep);
        } else {
          for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
              this.cellStates[c][r].offsetY = 0;
            }
          }
          soundManager.playReelStop();
          resolve();
        }
      };
      requestAnimationFrame(animateStep);
    });
  }

  animateWinningHighlight(winPositions) {
    const durationMs = this.engine.turbo ? 150 : 350;
    const startTime = performance.now();

    return new Promise((resolve) => {
      const animateStep = (now) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        
        winPositions.forEach(pos => {
          const st = this.cellStates[pos.col][pos.row];
          if (progress < 0.5) {
            st.scale = 1 + (progress / 0.5) * 0.35;
            st.glow = (progress / 0.5);
            st.rotation = (progress / 0.5) * 0.12;
          } else {
            const shrinkProgress = (progress - 0.5) / 0.5;
            st.scale = 1.35 * (1 - shrinkProgress);
            st.alpha = 1 - shrinkProgress;
            st.glow = 1 - shrinkProgress;
          }
        });

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          winPositions.forEach(pos => {
            const st = this.cellStates[pos.col][pos.row];
            st.scale = 1;
            st.alpha = 1;
            st.glow = 0;
            st.rotation = 0;
          });
          resolve();
        }
      };
      requestAnimationFrame(animateStep);
    });
  }

  async runTurnLoop() {
    let spinTotalWin = 0;
    let spinMultiplierSum = 0;
    let hasAnyWinThisSpin = false;

    while (true) {
      const evalResult = this.engine.evaluateWin();

      if (!evalResult.hasWin) break;

      hasAnyWinThisSpin = true;
      spinTotalWin += evalResult.payout;

      soundManager.playExplode();

      const winPositions = [];
      evalResult.winningGroups.forEach(group => {
        group.positions.forEach(pos => {
          winPositions.push(pos);
          const x = pos.col * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
          const y = pos.row * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
          this.spawnExplosion(x, y);
          this.spawnFloatingText(x, y, `+$${group.payout.toFixed(0)}`);
        });
      });

      this.uiManager.setWinAmount(spinTotalWin);

      await this.animateWinningHighlight(winPositions);

      this.engine.applyTumble(winPositions);

      await this.animateStaggeredDrop();
    }

    const multiplierOrbs = this.engine.getMultiplierOrbs();
    if (hasAnyWinThisSpin && multiplierOrbs.length > 0) {
      soundManager.playOrbSwoop();
      multiplierOrbs.forEach(orb => {
        spinMultiplierSum += orb.val;
        const x = orb.col * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
        const y = orb.row * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
        this.spawnMultiplierLaserBeam(x, y, this.gridWidth / 2, -30, orb.val);
      });

      await new Promise(res => setTimeout(res, 550));

      if (this.engine.isFreeSpins) {
        this.engine.globalMultiplierPool += spinMultiplierSum;
      }
    }

    let finalTotalMultiplier = Math.max(1, spinMultiplierSum);
    if (this.engine.isFreeSpins && this.engine.globalMultiplierPool > 0) {
      finalTotalMultiplier = Math.max(1, this.engine.globalMultiplierPool);
    }

    this.uiManager.setMultiplierDisplay(finalTotalMultiplier);

    const finalSpinPayout = spinTotalWin * finalTotalMultiplier;
    this.engine.balance += finalSpinPayout;
    this.uiManager.setWinAmount(finalSpinPayout);
    this.uiManager.updateDisplay();

    if (finalSpinPayout >= this.engine.getBet() * 20) {
      soundManager.playBigWin();
      await this.triggerFullscreenBigWin(finalSpinPayout);
    }

    const scattersRes = this.engine.countScatters();
    if (scattersRes.count >= 4 && !this.engine.isFreeSpins) {
      soundManager.playFreeSpinTrigger();
      await new Promise(res => setTimeout(res, 400));
      this.uiManager.showFreeSpinsModal(() => {
        this.engine.isFreeSpins = true;
        this.engine.freeSpinsRemaining = 15;
        this.engine.globalMultiplierPool = 0;
        this.engine.totalFreeSpinsWin = 0;
        this.uiManager.updateDisplay();
        this.onSpinClicked();
      });
    }
  }
}

function initApp() {
  window.gameApp = new GameApp();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initApp();
} else {
  window.addEventListener('DOMContentLoaded', initApp);
}
