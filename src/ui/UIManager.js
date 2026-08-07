import { soundManager } from '../logic/SoundManager.js';

export class UIManager {
  constructor(engine, onSpinTriggered, onBuyFeatureTriggered) {
    this.engine = engine;
    this.onSpinTriggered = onSpinTriggered;
    this.onBuyFeatureTriggered = onBuyFeatureTriggered;

    // DOM References
    this.elBalance = document.getElementById('ui-balance');
    this.elWin = document.getElementById('ui-win');
    this.elMultiplier = document.getElementById('ui-multiplier');
    this.elBetAmount = document.getElementById('ui-bet-amount');
    this.elBuyCost = document.getElementById('buy-feature-cost');
    this.elSpinBtn = document.getElementById('btn-spin');
    this.elBuyBtn = document.getElementById('btn-buy-feature');

    this.elTurboBtn = document.getElementById('btn-turbo');
    this.elTurboStatus = document.getElementById('turbo-status');

    this.elAutoBtn = document.getElementById('btn-auto');
    this.elAutoCount = document.getElementById('auto-count-display');

    this.elSoundBtn = document.getElementById('btn-sound');
    this.elInfoBtn = document.getElementById('btn-info');
    this.elInfoModal = document.getElementById('modal-info');
    this.elCloseInfoBtn = document.getElementById('btn-close-info');

    // Fullscreen Big Win Overlay References
    this.elFsBigWinOverlay = document.getElementById('fullscreen-bigwin-overlay');
    this.elFsBigWinTitle = document.getElementById('fs-bigwin-title');
    this.elFsBigWinAmount = document.getElementById('fs-bigwin-amount');
    this.elBtnCloseFsBigWin = document.getElementById('btn-close-fs-bigwin');

    this.elFreeSpinsModal = document.getElementById('modal-freespins');
    this.elStartFreeSpinsBtn = document.getElementById('btn-start-freespins');
    this.elFreeSpinsBanner = document.getElementById('freespins-banner');
    this.elFreeSpinsRemaining = document.getElementById('freespins-remaining');

    this.autoOptions = [0, 10, 20, 50, 100];
    this.autoIdx = 0;

    this.bindEvents();
    this.updateDisplay();
  }

  bindEvents() {
    const btnMinus = document.getElementById('btn-bet-minus');
    if (btnMinus) {
      btnMinus.addEventListener('click', (e) => {
        e.preventDefault();
        this.engine.setBetIdx(this.engine.currentBetIdx - 1);
        soundManager.playReelStop();
        this.updateDisplay();
      });
    }

    const btnPlus = document.getElementById('btn-bet-plus');
    if (btnPlus) {
      btnPlus.addEventListener('click', (e) => {
        e.preventDefault();
        this.engine.setBetIdx(this.engine.currentBetIdx + 1);
        soundManager.playReelStop();
        this.updateDisplay();
      });
    }

    if (this.elSpinBtn) {
      this.elSpinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        soundManager.init();
        if (this.onSpinTriggered) this.onSpinTriggered();
      });
    }

    if (this.elBuyBtn) {
      this.elBuyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        soundManager.init();
        if (this.onBuyFeatureTriggered) this.onBuyFeatureTriggered();
      });
    }

    if (this.elTurboBtn) {
      this.elTurboBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.engine.turbo = !this.engine.turbo;
        if (this.elTurboStatus) {
          this.elTurboStatus.textContent = this.engine.turbo ? 'ON' : 'OFF';
          this.elTurboStatus.className = this.engine.turbo ? 'text-amber-400 font-extrabold' : 'text-slate-500';
        }
        soundManager.playReelStop();
      });
    }

    if (this.elAutoBtn) {
      this.elAutoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.autoIdx = (this.autoIdx + 1) % this.autoOptions.length;
        this.engine.autoSpinCount = this.autoOptions[this.autoIdx];
        this.updateAutoSpinDisplay();
        soundManager.playReelStop();

        if (this.engine.autoSpinCount > 0 && !this.isSpinning) {
          if (this.onSpinTriggered) this.onSpinTriggered();
        }
      });
    }

    if (this.elSoundBtn) {
      this.elSoundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const muted = soundManager.toggleMute();
      });
    }

    if (this.elInfoBtn) {
      this.elInfoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.elInfoModal) this.elInfoModal.classList.remove('hidden');
        soundManager.playReelStop();
      });
    }
    if (this.elCloseInfoBtn) {
      this.elCloseInfoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.elInfoModal) this.elInfoModal.classList.add('hidden');
      });
    }

    if (this.elBtnCloseFsBigWin) {
      this.elBtnCloseFsBigWin.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.elFsBigWinOverlay) this.elFsBigWinOverlay.classList.add('hidden');
      });
    }
  }

  updateAutoSpinDisplay() {
    if (this.elAutoCount) {
      if (this.engine.autoSpinCount > 0) {
        this.elAutoCount.textContent = `${this.engine.autoSpinCount}`;
        this.elAutoCount.className = 'text-amber-400 font-extrabold';
      } else {
        this.elAutoCount.textContent = 'OFF';
        this.elAutoCount.className = 'text-slate-500';
      }
    }
  }

  updateDisplay() {
    if (this.elBalance) this.elBalance.textContent = `$${this.engine.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (this.elBetAmount) this.elBetAmount.textContent = `$${this.engine.getBet()}`;
    const buyCost = this.engine.getBet() * 100;
    if (this.elBuyCost) this.elBuyCost.textContent = `$${buyCost.toLocaleString()}`;
    this.updateAutoSpinDisplay();

    if (this.elFreeSpinsBanner) {
      if (this.engine.isFreeSpins) {
        this.elFreeSpinsBanner.classList.remove('hidden');
        if (this.elFreeSpinsRemaining) this.elFreeSpinsRemaining.textContent = `${this.engine.freeSpinsRemaining}`;
      } else {
        this.elFreeSpinsBanner.classList.add('hidden');
      }
    }
  }

  setWinAmount(amount) {
    if (this.elWin) this.elWin.textContent = `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  setMultiplierDisplay(multiplier) {
    if (this.elMultiplier) {
      this.elMultiplier.textContent = `${multiplier}x`;
      if (multiplier > 1) {
        this.elMultiplier.classList.add('gold-text-glow');
      } else {
        this.elMultiplier.classList.remove('gold-text-glow');
      }
    }
  }

  setControlsLock(locked) {
    this.isSpinning = locked;
    if (this.elSpinBtn) {
      this.elSpinBtn.disabled = locked;
      this.elSpinBtn.innerHTML = locked 
        ? `<span class="animate-pulse">旋轉中...</span>`
        : `<span>旋轉</span><svg class="w-5 h-5 fill-slate-950" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
    }
    if (this.elBuyBtn) {
      this.elBuyBtn.disabled = locked;
    }
  }

  showBigWinModal(winAmount) {
    let title = 'BIG WIN!';
    const bet = this.engine.getBet();
    if (winAmount >= bet * 100) title = 'SUPER MEGA WIN!';
    else if (winAmount >= bet * 50) title = 'MEGA WIN!';

    if (this.elFsBigWinTitle) this.elFsBigWinTitle.textContent = title;
    if (this.elFsBigWinAmount) this.elFsBigWinAmount.textContent = `$${winAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (this.elFsBigWinOverlay) this.elFsBigWinOverlay.classList.remove('hidden');
  }

  showFreeSpinsModal(onStart) {
    if (this.elFreeSpinsModal) this.elFreeSpinsModal.classList.remove('hidden');
    const handler = (e) => {
      e.preventDefault();
      if (this.elFreeSpinsModal) this.elFreeSpinsModal.classList.add('hidden');
      if (this.elStartFreeSpinsBtn) this.elStartFreeSpinsBtn.removeEventListener('click', handler);
      if (onStart) onStart();
    };
    if (this.elStartFreeSpinsBtn) this.elStartFreeSpinsBtn.addEventListener('click', handler);
  }
}
