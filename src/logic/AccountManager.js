/**
 * 社畜變賭徒 - 多使用者帳號註冊/登入與餘額持久化管理 (Account & Balance Storage)
 */

const STORAGE_KEY = 'corporate_slave_users_v4';
const CURRENT_USER_KEY = 'corporate_slave_current_user_v4';

export class AccountManager {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
    if (!this.currentUser) {
      // Default guest user starting balance strictly $2,000
      this.currentUser = this.register('社畜賭徒', 2000);
    }
    // Hard clamp all existing account balances to $2,000 if above $2,000 on fresh version load
    if (this.currentUser && this.currentUser.balance > 2000) {
      this.currentUser.balance = 2000;
      this.saveUsers();
    }
  }

  loadUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : {};
      // Ensure all users have max $2,000 balance
      Object.keys(parsed).forEach(k => {
        if (parsed[k].balance > 2000) parsed[k].balance = 2000;
      });
      return parsed;
    } catch (e) {
      return {};
    }
  }

  saveUsers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }

  loadCurrentUser() {
    try {
      const username = localStorage.getItem(CURRENT_USER_KEY);
      if (username && this.users[username]) {
        return this.users[username];
      }
    } catch (e) {}
    return null;
  }

  saveCurrentUserPointer(username) {
    try {
      localStorage.setItem(CURRENT_USER_KEY, username);
    } catch (e) {}
  }

  register(username, initialBalance = 2000) {
    const trimmed = username.trim();
    if (!trimmed) return null;

    if (!this.users[trimmed]) {
      this.users[trimmed] = {
        username: trimmed,
        balance: 2000,
        totalSpins: 0,
        totalWon: 0,
        createdAt: new Date().toISOString()
      };
      this.saveUsers();
    } else {
      this.users[trimmed].balance = Math.min(2000, this.users[trimmed].balance);
    }
    
    this.currentUser = this.users[trimmed];
    this.saveCurrentUserPointer(trimmed);
    return this.currentUser;
  }

  login(username) {
    const trimmed = username.trim();
    if (this.users[trimmed]) {
      this.currentUser = this.users[trimmed];
      this.saveCurrentUserPointer(trimmed);
      return this.currentUser;
    }
    return null;
  }

  updateBalance(newBalance) {
    if (this.currentUser) {
      this.currentUser.balance = newBalance;
      this.users[this.currentUser.username].balance = newBalance;
      this.saveUsers();
    }
  }

  getUserList() {
    return Object.values(this.users);
  }
}

export const accountManager = new AccountManager();
