import { soundManager } from '../logic/SoundManager.js';
import { accountManager } from '../logic/AccountManager.js';

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

    // Account DOM References
    this.elUsername = document.getElementById('ui-username');
    this.elBtnAccountSwitch = document.getElementById('btn-account-switch');
    this.elModalAccount = document.getElementById('modal-account');
    this.elBtnCloseAccount = document.getElementById('btn-close-account');
    this.elSelectUser = document.getElementById('select-user');
    this.elBtnDoLogin = document.getElementById('btn-do-login');
    this.elInputNewUsername = document.getElementById('input-new-username');
    this.elBtnDoRegister = document.getElementById('btn-do-register');

    // Fullscreen Big Win Overlay References
    this.elFsBigWinOverlay = document.getElementById('fullscreen-bigwin-overlay');
    this.elFsBigWinTitle = document.getElementById('fs-bigwin-title');
    this.elFsBigWinAmount = document.getElementById('fs-bigwin-amount');
    this.elFsBigWinMultiplier = document.getElementById('fs-bigwin-multiplier');
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
        
        // If Auto Spin is active, clicking it CANCELS / STOPS auto spin immediately!
        if (this.engine.autoSpinCount > 0) {
          this.engine.autoSpinCount = 0;
          this.autoIdx = 0;
          this.updateAutoSpinDisplay();
          soundManager.playReelStop();
          return;
        }

        // Cycle through auto spin count options: 10, 20, 50, 100
        this.autoIdx = (this.autoIdx + 1) % this.autoOptions.length;
        if (this.autoIdx === 0) this.autoIdx = 1; // Default to 10
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
        soundManager.toggleMute();
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

    // Account Modal Bindings
    if (this.elBtnAccountSwitch) {
      this.elBtnAccountSwitch.addEventListener('click', (e) => {
        e.preventDefault();
        this.populateAccountDropdown();
        if (this.elModalAccount) this.elModalAccount.classList.remove('hidden');
      });
    }
    if (this.elBtnCloseAccount) {
      this.elBtnCloseAccount.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.elModalAccount) this.elModalAccount.classList.add('hidden');
      });
    }
    if (this.elBtnDoLogin) {
      this.elBtnDoLogin.addEventListener('click', (e) => {
        e.preventDefault();
        const selected = this.elSelectUser.value;
        if (selected) {
          accountManager.login(selected);
          this.engine.syncBalanceWithAccount();
          this.updateDisplay();
          if (this.elModalAccount) this.elModalAccount.classList.add('hidden');
          alert(`歡迎回來，${selected}！已載入您的專屬餘額：$${this.engine.balance.toLocaleString()}`);
        }
      });
    }
    if (this.elBtnDoRegister) {
      this.elBtnDoRegister.addEventListener('click', (e) => {
        e.preventDefault();
        const inputName = this.elInputNewUsername.value.trim();
        if (!inputName) {
          alert('請輸入玩家暱稱！');
          return;
        }
        accountManager.register(inputName, 2000);
        this.engine.syncBalanceWithAccount();
        this.updateDisplay();
        if (this.elModalAccount) this.elModalAccount.classList.add('hidden');
        this.elInputNewUsername.value = '';
        alert(`註冊成功！新玩家 [${inputName}] 已登入，獲得初始籌碼 $2,000！`);
      });
    }

    if (this.elBtnCloseFsBigWin) {
      this.elBtnCloseFsBigWin.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.elFsBigWinOverlay) this.elFsBigWinOverlay.classList.add('hidden');
      });
    }
  }

  populateAccountDropdown() {
    if (!this.elSelectUser) return;
    this.elSelectUser.innerHTML = '';
    const users = accountManager.getUserList();
    users.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.username;
      opt.textContent = `${u.username} (餘額: $${u.balance.toLocaleString()})`;
      if (accountManager.currentUser && accountManager.currentUser.username === u.username) {
        opt.selected = true;
      }
      this.elSelectUser.appendChild(opt);
    });
  }

  updateAutoSpinDisplay() {
    if (this.elAutoCount) {
      if (this.engine.autoSpinCount > 0) {
        this.elAutoCount.textContent = `停止 (${this.engine.autoSpinCount})`;
        this.elAutoCount.className = 'text-red-400 font-extrabold animate-pulse';
      } else {
        this.elAutoCount.textContent = 'OFF';
        this.elAutoCount.className = 'text-slate-500';
      }
    }
  }

  updateDisplay() {
    this.engine.saveAccountBalance();

    if (this.elUsername && accountManager.currentUser) {
      this.elUsername.textContent = accountManager.currentUser.username;
    }
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
      if (typeof multiplier === 'string') {
        this.elMultiplier.textContent = multiplier;
        this.elMultiplier.classList.add('gold-text-glow');
      } else {
        this.elMultiplier.textContent = `${multiplier}x`;
        if (multiplier > 1) {
          this.elMultiplier.classList.add('gold-text-glow');
        } else {
          this.elMultiplier.classList.remove('gold-text-glow');
        }
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



  showBigWinModal(winAmount, tier = 1) {
    let title = 'BIG WIN! 💰 金幣滿屋';
    if (tier === 3) {
      title = 'SUPER MEGA WIN! 🐱🐶 貓狗暴富狂歡';
    } else if (tier === 2) {
      title = 'MEGA WIN! 🐾 貓狗開心數錢';
    }

    const bet = Math.max(1, this.engine.getBet());
    const rawMult = winAmount / bet;
    const multiplierStr = rawMult % 1 === 0 ? rawMult.toFixed(0) : rawMult.toFixed(2);

    if (this.elFsBigWinTitle) this.elFsBigWinTitle.textContent = title;
    if (this.elFsBigWinAmount) this.elFsBigWinAmount.textContent = `$${winAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (this.elFsBigWinMultiplier) this.elFsBigWinMultiplier.textContent = `${multiplierStr}X`;
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
