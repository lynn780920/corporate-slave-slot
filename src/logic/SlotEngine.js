/**
 * Gates of Set 2 (戰神賽特2 覺醒之力) - Slot Engine
 * Pay Anywhere (8+ Match), Tumble Cascading, Multipliers (2x-500x), Awakening Skills & Free Spins
 */

export const SYMBOLS = {
  EYE: 'eye',                 // 荷魯斯之眼 (High 1)
  SCEPTER: 'scepter',         // 權杖 (High 2)
  BOW: 'bow',                 // 弓箭 (High 3)
  SWORD: 'sword',             // 彎刀 (High 4)
  GEM_ORANGE: 'gem_orange',   // 橘寶石 (Mid 1)
  GEM_RED: 'gem_red',         // 紅寶石 (Mid 2)
  GEM_PURPLE: 'gem_purple',   // 紫寶石 (Low 1)
  GEM_BLUE: 'gem_blue',       // 藍寶石 (Low 2)
  GEM_GREEN: 'gem_green',     // 綠寶石 (Low 3)
  GOD_MALE: 'god_male',       // 力量覺醒符號
  GOD_FEMALE: 'god_female',   // 鎖定覺醒符號
  SCATTER: 'scatter',         // 聖甲蟲 SCATTER
  MULTIPLIER: 'multiplier'   // 乘數寶珠
};

// Relative multiplier per total bet size
export const PAYTABLE = {
  [SYMBOLS.EYE]:        { 8: 10.0, 10: 25.0, 12: 50.0 },
  [SYMBOLS.SCEPTER]:    { 8: 2.5,  10: 10.0, 12: 25.0 },
  [SYMBOLS.BOW]:        { 8: 2.0,  10: 5.0,  12: 15.0 },
  [SYMBOLS.SWORD]:      { 8: 1.5,  10: 2.0,  12: 12.0 },
  [SYMBOLS.GEM_ORANGE]: { 8: 1.0,  10: 1.5,  12: 10.0 },
  [SYMBOLS.GEM_RED]:    { 8: 0.8,  10: 1.2,  12: 8.0 },
  [SYMBOLS.GEM_PURPLE]: { 8: 0.5,  10: 1.0,  12: 5.0 },
  [SYMBOLS.GEM_BLUE]:   { 8: 0.4,  10: 0.9,  12: 4.0 },
  [SYMBOLS.GEM_GREEN]:  { 8: 0.25, 10: 0.75, 12: 2.0 },
  [SYMBOLS.GOD_MALE]:   { 8: 5.0,  10: 15.0, 12: 30.0 },
  [SYMBOLS.GOD_FEMALE]: { 8: 5.0,  10: 15.0, 12: 30.0 },
  [SYMBOLS.SCATTER]:    { 4: 3.0,  5: 5.0,   6: 100.0 }
};

export const MULTIPLIER_VALUES = [2, 3, 4, 5, 8, 10, 12, 15, 20, 25, 50, 100, 250, 500];

export class SlotEngine {
  constructor() {
    this.cols = 6;
    this.rows = 5;
    this.balance = 10000;
    this.betSizes = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
    this.currentBetIdx = 3; // Default $100
    this.currentBet = this.betSizes[this.currentBetIdx];

    // Mode States
    this.isFreeSpins = false;
    this.freeSpinsRemaining = 0;
    this.totalFreeSpinsWin = 0;
    this.globalMultiplierPool = 0;

    this.turbo = false;
    this.autoSpinCount = 0;

    this.grid = [];
    this.nextSymbolId = 1;

    this.initializeGrid();
  }

  getBet() {
    return this.currentBet;
  }

  setBetIdx(idx) {
    if (idx >= 0 && idx < this.betSizes.length) {
      this.currentBetIdx = idx;
      this.currentBet = this.betSizes[idx];
    }
  }

  initializeGrid() {
    this.grid = [];
    for (let c = 0; c < this.cols; c++) {
      const col = [];
      for (let r = 0; r < this.rows; r++) {
        col.push(this.generateRandomSymbol());
      }
      this.grid.push(col);
    }
  }

  generateRandomSymbol(forceScatter = false) {
    const id = this.nextSymbolId++;
    if (forceScatter) {
      return { type: SYMBOLS.SCATTER, id, multiplierVal: 0 };
    }

    const rand = Math.random();
    
    // 5% chance of Multiplier Orb
    if (rand < 0.05) {
      const multVal = this.getRandomMultiplierValue();
      return { type: SYMBOLS.MULTIPLIER, id, multiplierVal: multVal };
    }

    // 4% chance of Scatter
    if (rand < 0.09) {
      return { type: SYMBOLS.SCATTER, id, multiplierVal: 0 };
    }

    // 3% chance of Male God Awakening
    if (rand < 0.12) {
      return { type: SYMBOLS.GOD_MALE, id, multiplierVal: 0 };
    }

    // 3% chance of Female Goddess Awakening
    if (rand < 0.15) {
      return { type: SYMBOLS.GOD_FEMALE, id, multiplierVal: 0 };
    }

    // Weighted regular pay symbols
    const weightedTypes = [
      SYMBOLS.GEM_GREEN, SYMBOLS.GEM_GREEN, SYMBOLS.GEM_GREEN,
      SYMBOLS.GEM_BLUE, SYMBOLS.GEM_BLUE,
      SYMBOLS.GEM_PURPLE, SYMBOLS.GEM_PURPLE,
      SYMBOLS.GEM_RED,
      SYMBOLS.GEM_ORANGE,
      SYMBOLS.SWORD,
      SYMBOLS.BOW,
      SYMBOLS.SCEPTER,
      SYMBOLS.EYE
    ];
    const chosenType = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
    return { type: chosenType, id, multiplierVal: 0 };
  }

  getRandomMultiplierValue() {
    const rand = Math.random();
    if (rand < 0.50) return [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    if (rand < 0.80) return [8, 10, 12, 15][Math.floor(Math.random() * 4)];
    if (rand < 0.95) return [20, 25, 50][Math.floor(Math.random() * 3)];
    return [100, 250, 500][Math.floor(Math.random() * 3)];
  }

  generateSpinGrid(isBuyFeature = false) {
    this.grid = [];
    let scatterCount = 0;

    for (let c = 0; c < this.cols; c++) {
      const col = [];
      for (let r = 0; r < this.rows; r++) {
        const forceScatter = isBuyFeature && scatterCount < 4 && Math.random() < 0.35;
        const sym = this.generateRandomSymbol(forceScatter);
        if (sym.type === SYMBOLS.SCATTER) scatterCount++;
        col.push(sym);
      }
      this.grid.push(col);
    }

    if (isBuyFeature && scatterCount < 4) {
      for (let i = scatterCount; i < 4; i++) {
        const c = Math.floor(Math.random() * this.cols);
        const r = Math.floor(Math.random() * this.rows);
        this.grid[c][r] = { type: SYMBOLS.SCATTER, id: this.nextSymbolId++, multiplierVal: 0 };
      }
    }
  }

  evaluateWin() {
    const symbolCounts = {};
    const symbolPositions = {};

    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const sym = this.grid[c][r];
        if (!sym) continue;

        if (sym.type !== SYMBOLS.MULTIPLIER) {
          if (!symbolCounts[sym.type]) {
            symbolCounts[sym.type] = 0;
            symbolPositions[sym.type] = [];
          }
          symbolCounts[sym.type]++;
          symbolPositions[sym.type].push({ col: c, row: r, id: sym.id });
        }
      }
    }

    const winningGroups = [];
    let totalSpinPayoutMultiplier = 0;

    for (const [type, count] of Object.entries(symbolCounts)) {
      if (type === SYMBOLS.SCATTER) continue;

      if (count >= 8) {
        let payFactor = 0;
        const payTableMap = PAYTABLE[type];
        if (payTableMap) {
          if (count >= 12) payFactor = payTableMap[12];
          else if (count >= 10) payFactor = payTableMap[10];
          else if (count >= 8) payFactor = payTableMap[8];
        }

        const payout = payFactor * this.currentBet;
        totalSpinPayoutMultiplier += payFactor;

        winningGroups.push({
          type,
          count,
          payout,
          positions: symbolPositions[type]
        });
      }
    }

    return {
      hasWin: winningGroups.length > 0,
      winningGroups,
      payout: winningGroups.reduce((acc, g) => acc + g.payout, 0)
    };
  }

  countScatters() {
    let count = 0;
    const positions = [];
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        if (this.grid[c][r] && this.grid[c][r].type === SYMBOLS.SCATTER) {
          count++;
          positions.push({ col: c, row: r });
        }
      }
    }
    return { count, positions };
  }

  getMultiplierOrbs() {
    const orbs = [];
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const sym = this.grid[c][r];
        if (sym && sym.type === SYMBOLS.MULTIPLIER) {
          orbs.push({ col: c, row: r, val: sym.multiplierVal, id: sym.id });
        }
      }
    }
    return orbs;
  }

  applyTumble(winningPositions) {
    const posSet = new Set(winningPositions.map(p => `${p.col},${p.row}`));
    
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        if (posSet.has(`${c},${r}`)) {
          this.grid[c][r] = null;
        }
      }
    }

    for (let c = 0; c < this.cols; c++) {
      const existingSymbols = [];
      for (let r = 0; r < this.rows; r++) {
        if (this.grid[c][r] !== null) {
          existingSymbols.push(this.grid[c][r]);
        }
      }

      const newCol = new Array(this.rows).fill(null);
      let targetRow = this.rows - 1;

      for (let i = existingSymbols.length - 1; i >= 0; i--) {
        newCol[targetRow] = existingSymbols[i];
        targetRow--;
      }

      while (targetRow >= 0) {
        newCol[targetRow] = this.generateRandomSymbol();
        targetRow--;
      }

      this.grid[c] = newCol;
    }
  }
}
