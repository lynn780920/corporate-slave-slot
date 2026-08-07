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
    this.fsCoins = [];
    this.fsBills = [];
    this.fsPets = [];

    this.bigWinMode = false;
    this.bigWinTarget = 0;
    this.bigWinCurrent = 0;
    this.bigWinTier = 1; // Tier 1 (<20x), Tier 2 (20x-40x), Tier 3 (>=40x)
    this.sunburstAngle = 0;

    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.globalTime = 0;

    this.godFlashAlpha = 0;
    this.godFlashColor = '#f59e0b';
    this.godRaysAngle = 0;

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

    const unlockAudio = () => {
      soundManager.init();
      soundManager.startBGM();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.renderLoop(t));
  }

  preloadAssets() {
    const assetList = [
      'eye', 'scepter', 'bow', 'sword', 
      'gem_orange', 'gem_red', 'gem_purple', 'gem_blue', 'gem_green',
      'scatter', 'god_male', 'god_female', 'chairman_cat', 'gm_husky',
      'multiplier', 'mult_green', 'mult_blue', 'mult_purple', 'bg_gods'
    ];

    const baseUrl = (typeof import.meta !== 'undefined' && import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : './';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

    assetList.forEach(name => {
      const img = new Image();
      img.src = `${cleanBase}assets/${name}.png`;
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

  // Tiered Big Win Celebration Engine (Tier 1: <20x Gold Coins, Tier 2: 20x-40x Pets Counting Money, Tier 3: >=40x Flying Cash & Party)
  triggerFullscreenBigWin(winAmount) {
    const bet = this.engine.getBet();
    const winMult = winAmount / bet;
    const validWin = Math.max(winAmount || 0, bet * 20);

    if (winMult >= 40) {
      this.bigWinTier = 3;
    } else if (winMult >= 20) {
      this.bigWinTier = 2;
    } else {
      this.bigWinTier = 1;
    }

    this.bigWinMode = true;
    this.bigWinTarget = validWin;
    this.bigWinCurrent = 0;
    this.fsCoins = [];
    this.fsBills = [];
    this.fsPets = [];

    this.uiManager.showBigWinModal(validWin, this.bigWinTier);

    const sw = window.innerWidth;
    const sh = window.innerHeight;

    // 1. Raining 3D Coins
    const coinCount = this.bigWinTier === 3 ? 600 : (this.bigWinTier === 2 ? 450 : 300);
    for (let i = 0; i < coinCount; i++) {
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

    // 2. Flying $100 Cash Bills for Tier 3
    if (this.bigWinTier === 3) {
      for (let i = 0; i < 120; i++) {
        this.fsBills.push({
          x: Math.random() * sw,
          y: -50 - Math.random() * 1000,
          vx: (Math.random() - 0.5) * 6,
          vy: 4 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          w: 50 + Math.random() * 30,
          h: 25 + Math.random() * 15
        });
      }
    }

    // 3. Floating Pets Counting Money for Tier 2 & Tier 3
    if (this.bigWinTier >= 2) {
      const petImages = ['eye', 'scepter', 'bow', 'sword', 'gem_orange', 'gem_red', 'gem_purple', 'gem_blue', 'gem_green'];
      const petPhrases = ['「年終爆滿!」', '「爽領大獎!」', '「數錢數到抽筋!」', '「貓狗發大財!」', '「不用加班啦!」'];

      for (let i = 0; i < (this.bigWinTier === 3 ? 10 : 6); i++) {
        this.fsPets.push({
          x: 80 + Math.random() * (sw - 160),
          y: sh + 100 + i * 140,
          vy: -2 - Math.random() * 2.5,
          scale: 0.8 + Math.random() * 0.5,
          imgKey: petImages[i % petImages.length],
          phrase: petPhrases[i % petPhrases.length],
          bobOffset: Math.random() * 10
        });
      }
    }

    this.triggerShake(this.bigWinTier * 10 + 10, 45);

    return new Promise((resolve) => {
      const durationMs = this.bigWinTier === 3 ? 4200 : (this.bigWinTier === 2 ? 3500 : 3000);
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        this.bigWinCurrent = this.bigWinTarget * progress;

        const elAmount = document.getElementById('fs-bigwin-amount');
        const elMult = document.getElementById('fs-bigwin-multiplier');
        const currentBet = Math.max(1, this.engine.getBet());

        if (elAmount) {
          elAmount.textContent = `$${this.bigWinCurrent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (elMult) {
          const m = this.bigWinCurrent / currentBet;
          elMult.textContent = `${(m % 1 === 0 ? m.toFixed(0) : m.toFixed(2))}X`;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          this.bigWinCurrent = this.bigWinTarget;
          if (elAmount) {
            elAmount.textContent = `$${this.bigWinTarget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
          if (elMult) {
            const tm = this.bigWinTarget / currentBet;
            elMult.textContent = `${(tm % 1 === 0 ? tm.toFixed(0) : tm.toFixed(2))}X`;
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
    this.sunburstAngle += this.bigWinTier === 3 ? 0.025 : 0.012;

    if (this.ctx) {
      this.drawMainScene();
    }
    if (this.fsCtx && this.bigWinMode) {
      this.drawFullscreenBigWinScene();
    }

    requestAnimationFrame((t) => this.renderLoop(t));
  }

  drawGatesOfSetMascots(ctx, w, h) {
    const time = this.globalTime;

    // 1. Left Mascot: 👑 董事長貓皇 (Chairman Cat Emperor)
    const catX = 40;
    const catY = 38;
    const catPulse = 1 + Math.sin(time * 4) * 0.08;

    ctx.save();
    ctx.translate(catX, catY);

    // Glowing Aura Ring
    ctx.save();
    ctx.scale(catPulse, catPulse);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    const catImg = this.loadedImages['chairman_cat'];
    if (catImg) {
      ctx.drawImage(catImg, -26, -26, 52, 52);
    }
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-26, -26, 52, 52);
    ctx.restore();

    // Badge Title Label
    ctx.font = '900 11px Outfit, Cinzel, sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText('👑貓皇', 0, 36);
    ctx.fillText('👑貓皇', 0, 36);
    ctx.restore();

    // 2. Right Mascot: 👔 總經理哈士奇 (GM Husky)
    const huskyX = w - 40;
    const huskyY = 38;
    const huskyPulse = 1 + Math.cos(time * 4) * 0.08;

    ctx.save();
    ctx.translate(huskyX, huskyY);

    // Glowing Aura Ring
    ctx.save();
    ctx.scale(huskyPulse, huskyPulse);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    const huskyImg = this.loadedImages['gm_husky'];
    if (huskyImg) {
      ctx.drawImage(huskyImg, -26, -26, 52, 52);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-26, -26, 52, 52);
    ctx.restore();

    // Badge Title Label
    ctx.font = '900 11px Outfit, Cinzel, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText('👔哈士奇', 0, 36);
    ctx.fillText('👔哈士奇', 0, 36);
    ctx.restore();
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

    // Ornate Border Frame
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.strokeRect(3, 3, w - 6, h - 6);
    ctx.shadowBlur = 0;

    this.drawGatesOfSetMascots(ctx, w, h);

    // 6x5 Grid Cells & Render PNG Symbols Cropped from User Screenshot
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const x = c * (this.cellSize + this.cellGap) + this.cellGap;
        const y = r * (this.cellSize + this.cellGap) + this.cellGap;
        const state = this.cellStates[c][r];

        ctx.fillStyle = 'rgba(18, 13, 28, 0.88)';
        ctx.strokeStyle = state.glow > 0 ? '#fde047' : 'rgba(59, 45, 84, 0.7)';
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

          if (sym.type === SYMBOLS.MULTIPLIER) {
            const orbPulseScale = 1.0 + Math.sin(this.globalTime * 6) * 0.12;
            ctx.scale(state.scale * orbPulseScale, state.scale * orbPulseScale);
          } else {
            ctx.scale(state.scale, state.scale);
          }

          ctx.rotate(state.rotation);
          ctx.globalAlpha = state.alpha;

          let imgKey = sym.type;
          if (sym.type === SYMBOLS.GOD_MALE) imgKey = 'chairman_cat';
          else if (sym.type === SYMBOLS.GOD_FEMALE) imgKey = 'gm_husky';
          
          const img = this.loadedImages[imgKey] || this.loadedImages[sym.type];
          if (img) {
            const drawSize = this.cellSize * 0.92;
            ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
          }

          // Overlay Multiplier Value Text on Multiplier Orbs
          if (sym.type === SYMBOLS.MULTIPLIER) {
            ctx.font = '900 36px Outfit, Cinzel, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 8;
            ctx.strokeText(`${sym.multiplierVal}x`, 0, 1);

            ctx.fillStyle = '#fde047';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 14;
            ctx.fillText(`${sym.multiplierVal}x`, 0, 1);
            ctx.shadowBlur = 0;
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

    // Laser Beams
    for (let i = this.laserBeams.length - 1; i >= 0; i--) {
      const b = this.laserBeams[i];
      b.progress += b.speed;
      if (b.progress >= 1) {
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

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.lineWidth = 12;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(p1.x, p1.y, currX, currY);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(currX, currY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

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

    // Gates of Set God Awakening Flash Rays Overlay
    if (this.godFlashAlpha > 0) {
      this.godFlashAlpha -= 0.02;
      this.godRaysAngle += 0.03;

      ctx.save();
      ctx.globalAlpha = Math.max(0, this.godFlashAlpha);
      ctx.globalCompositeOperation = 'screen';
      
      const cx = this.gridWidth / 2;
      const cy = this.gridHeight / 2;

      ctx.translate(cx, cy);
      ctx.rotate(this.godRaysAngle);
      ctx.fillStyle = this.godFlashColor;
      
      const numRays = 16;
      const rayLen = Math.max(this.gridWidth, this.gridHeight) * 1.5;
      for (let i = 0; i < numRays; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, rayLen, (i * 2 * Math.PI) / numRays, ((i * 2 + 1) * Math.PI) / numRays);
        ctx.lineTo(0, 0);
        ctx.fill();
      }

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

    // 1. Rotating Sunburst Light Rays
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.sunburstAngle);
    const numRays = this.bigWinTier === 3 ? 24 : 16;
    ctx.fillStyle = this.bigWinTier === 3 ? 'rgba(236, 72, 153, 0.22)' : 'rgba(245, 158, 11, 0.18)';
    const rayLength = Math.max(w, h) * 1.5;
    for (let i = 0; i < numRays; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, rayLength, (i * 2 * Math.PI) / numRays, ((i * 2 + 1) * Math.PI) / numRays);
      ctx.lineTo(0, 0);
      ctx.fill();
    }
    ctx.restore();

    // 2. Raining 3D Gold Coins
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

    // 3. Flying $100 Cash Bills for Tier 3 (Win >= 40x)
    if (this.bigWinTier === 3) {
      for (let i = 0; i < this.fsBills.length; i++) {
        const b = this.fsBills[i];
        b.y += b.vy;
        b.x += b.vx + Math.sin(this.globalTime * 3 + i) * 1.5;
        b.rotation += b.rotSpeed;

        if (b.y > h + 50) {
          b.y = -40;
          b.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);

        ctx.fillStyle = '#16a34a'; ctx.strokeStyle = '#86efac'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 4); ctx.fill(); ctx.stroke();
        ctx.font = '900 12px Outfit, sans-serif'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('$100', 0, 0);

        ctx.restore();
      }
    }

    // 4. Floating Working Pets (Cats & Dogs) Counting Money & Celebrating (Tier 2 & Tier 3)
    if (this.bigWinTier >= 2) {
      for (let i = 0; i < this.fsPets.length; i++) {
        const pet = this.fsPets[i];
        pet.y += pet.vy;
        if (pet.y < -120) {
          pet.y = h + 100;
          pet.x = 80 + Math.random() * (w - 160);
        }

        const floatX = pet.x + Math.sin(this.globalTime * 2 + pet.bobOffset) * 20;

        ctx.save();
        ctx.translate(floatX, pet.y);
        ctx.scale(pet.scale, pet.scale);

        // Pet Image Avatar
        const img = this.loadedImages[pet.imgKey];
        if (img) {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 20;
          ctx.drawImage(img, -45, -45, 90, 90);
          ctx.shadowBlur = 0;
        }

        // Phrase Ribbon Text Badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(-60, 48, 120, 28, 8); ctx.fill(); ctx.stroke();

        ctx.font = '900 12px Outfit, sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.textAlign = 'center';
        ctx.fillText(pet.phrase, 0, 64);

        ctx.restore();
      }
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
        if (this.engine.lockedMultiplierSpins > 0 && this.engine.lockedMultiplierVal > 0) {
          this.uiManager.setMultiplierDisplay(`🔒 ${this.engine.lockedMultiplierVal}x (${this.engine.lockedMultiplierSpins}局)`);
        } else {
          this.uiManager.setMultiplierDisplay(1);
        }
      } else {
        this.engine.freeSpinsRemaining--;
        if (this.engine.lockedMultiplierSpins > 0 && this.engine.lockedMultiplierVal > 0) {
          this.uiManager.setMultiplierDisplay(`🔒 ${this.engine.lockedMultiplierVal}x (${this.engine.lockedMultiplierSpins}局)`);
        } else {
          this.uiManager.setMultiplierDisplay(Math.max(1, this.engine.globalMultiplierPool));
        }
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
      if (this.engine.totalFreeSpinsWin > 0) {
        await this.triggerFullscreenBigWin(this.engine.totalFreeSpinsWin);
      }
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
        if (group.type === SYMBOLS.GOD_MALE) {
          const firstPos = group.positions[0];
          const x = firstPos.col * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
          const y = firstPos.row * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
          
          if (this.engine.lockedMultiplierVal > 0) {
            this.engine.lockedMultiplierVal *= 2;
          }

          // Double multiplier values on all grid orbs & shoot lightning laser beams!
          for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
              if (this.engine.grid[c][r] && this.engine.grid[c][r].type === SYMBOLS.MULTIPLIER) {
                this.engine.grid[c][r].multiplierVal *= 2;
                const orbX = c * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
                const orbY = r * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
                this.spawnMultiplierLaserBeam(x, y, orbX, orbY, this.engine.grid[c][r].multiplierVal);
                this.spawnShockwave(orbX, orbY);
              }
            }
          }

          this.godFlashAlpha = 0.85;
          this.godFlashColor = 'rgba(253, 224, 71, 0.4)';
          this.triggerShake(22, 30);
          this.spawnFloatingText(x, y - 40, `👑 力量覺醒！倍數 2 倍翻倍！`);
          soundManager.playBigWin();
        } else if (group.type === SYMBOLS.GOD_FEMALE) {
          const firstPos = group.positions[0];
          const x = firstPos.col * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
          const y = firstPos.row * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;

          this.engine.lockedMultiplierSpins = 4; // Active for 3 subsequent spins
          const baseLock = Math.max(this.engine.lockedMultiplierVal || 0, spinMultiplierSum || 0, 15);
          this.engine.lockedMultiplierVal = baseLock;

          for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
              if (this.engine.grid[c][r] && this.engine.grid[c][r].type === SYMBOLS.MULTIPLIER) {
                const orbX = c * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
                const orbY = r * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
                this.spawnMultiplierLaserBeam(x, y, orbX, orbY, baseLock);
                this.spawnShockwave(orbX, orbY);
              }
            }
          }

          this.godFlashAlpha = 0.85;
          this.godFlashColor = 'rgba(56, 189, 248, 0.4)';
          this.triggerShake(22, 30);
          this.spawnFloatingText(x, y - 40, `👔 鎖定覺醒！鎖定 ${baseLock}x 保留 3 局！`);
          soundManager.playBigWin();
        }

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
      multiplierOrbs.forEach((orb, idx) => {
        spinMultiplierSum += orb.val;
        const x = orb.col * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
        const y = orb.row * (this.cellSize + this.cellGap) + this.cellGap + this.cellSize / 2;
        
        // Gates of Set Animation: Side God mascot shoots electric beam directly to orb!
        const mascotX = idx % 2 === 0 ? 40 : (this.gridWidth - 40);
        const mascotY = 38;
        this.spawnMultiplierLaserBeam(mascotX, mascotY, x, y, orb.val);
        this.spawnShockwave(x, y);
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

    if (this.engine.lockedMultiplierSpins > 0 && this.engine.lockedMultiplierVal > 0) {
      finalTotalMultiplier = Math.max(finalTotalMultiplier, this.engine.lockedMultiplierVal);
    }

    if (this.engine.lockedMultiplierSpins > 0 && this.engine.lockedMultiplierVal > 0) {
      this.uiManager.setMultiplierDisplay(`🔒 ${this.engine.lockedMultiplierVal}x (${this.engine.lockedMultiplierSpins - 1}局)`);
    } else {
      this.uiManager.setMultiplierDisplay(finalTotalMultiplier);
    }

    const finalSpinPayout = spinTotalWin * finalTotalMultiplier;
    this.engine.balance += finalSpinPayout;
    this.uiManager.setWinAmount(finalSpinPayout);
    this.uiManager.updateDisplay();

    if (this.engine.lockedMultiplierSpins > 0) {
      this.engine.lockedMultiplierSpins--;
    }

    if (this.engine.isFreeSpins) {
      this.engine.totalFreeSpinsWin += finalSpinPayout;
    }

    if (finalSpinPayout >= this.engine.getBet() * 40) {
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
