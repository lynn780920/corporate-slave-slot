/**
 * 社畜變賭徒 - 多使用者帳號註冊/登入與餘額持久化管理 (Account & Balance Storage)
 */

const DEVICE_BALANCE_KEY = 'corporate_slave_device_balance_v10k';

export class AccountManager {
  constructor() {
    // Purge ALL old version keys from localStorage so everyone starts fresh at $10,000
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('corporate_slave_') || key.startsWith('slot_') || key.includes('user'))) {
          if (key !== DEVICE_BALANCE_KEY) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (e) {}

    let savedBal = null;
    try {
      const raw = localStorage.getItem(DEVICE_BALANCE_KEY);
      if (raw !== null) {
        savedBal = parseFloat(raw);
      }
    } catch (e) {}

    if (savedBal === null || isNaN(savedBal) || savedBal <= 0) {
      savedBal = 10000;
      this.saveDeviceBalance(10000);
    }

    this.currentUser = {
      username: '社畜賭徒',
      balance: savedBal
    };
  }

  saveDeviceBalance(bal) {
    try {
      localStorage.setItem(DEVICE_BALANCE_KEY, bal.toString());
    } catch (e) {}
  }

  updateBalance(newBalance) {
    if (this.currentUser) {
      this.currentUser.balance = newBalance;
      this.saveDeviceBalance(newBalance);
    }
  }

  getUserList() {
    return [this.currentUser];
  }
}

export const accountManager = new AccountManager();
