// =====================================================
// BYTE FRONTIERS — Secret codes
// =====================================================
// Loaded by index.html BEFORE game.js. game.js calls BFCodes.redeem() when the
// player picks "Codes" in the menu. Each code can only be redeemed once per
// account (the list of redeemed codes is stored in the save file).
//
// To add or change a code, edit CODE_REWARDS below.
(function () {
  "use strict";

  // code (UPPERCASE) -> permanent stat boost
  const CODE_REWARDS = {
    FREEDOM:   { attack: 10, defence: 10 },
    A7XY:      { attack: 10, defence: 10 },
    BRQR:      { attack: 10, defence: 10 },
    NAND:      { attack: 10, defence: 10 },
    LOGIC:     { attack: 10, defence: 10 },
    ZERO_HOPE: { attack: 10, defence: 10 },
  };

  const TOTAL_CODES = Object.keys(CODE_REWARDS).length;

  function normalize(code) {
    return String(code == null ? "" : code).trim().toUpperCase();
  }

  function describe(reward) {
    const parts = [];
    if (reward.attack) parts.push(`+${reward.attack} ATK`);
    if (reward.defence) parts.push(`+${reward.defence} DEF`);
    if (reward.spattack) parts.push(`+${reward.spattack} SP.ATK`);
    if (reward.speed) parts.push(`+${reward.speed} SPD`);
    return parts.join(", ");
  }

  /**
   * Try to redeem a code against the game state.
   * Mutates state (attack/defence/bonus/redeemedCodes) on success.
   * Returns { ok: boolean, message: string, changed: boolean }.
   */
  function redeem(rawCode, state) {
    const code = normalize(rawCode);
    if (!code) return { ok: false, changed: false, message: "No code entered." };
    if (!state || state.currentelectromon < 1) {
      return { ok: false, changed: false, message: "Hatch an Electromon first!" };
    }

    const reward = CODE_REWARDS[code];
    if (!reward) return { ok: false, changed: false, message: "Incorrect code!" };

    if (!Array.isArray(state.redeemedCodes)) state.redeemedCodes = [];
    if (state.redeemedCodes.includes(code)) {
      return { ok: false, changed: false, message: "You already used that code!" };
    }

    for (const stat of ["attack", "defence", "spattack", "speed"]) {
      if (reward[stat]) {
        state[stat] = (state[stat] || 0) + reward[stat];
        if (state.bonus) state.bonus[stat] = (state.bonus[stat] || 0) + reward[stat];
      }
    }
    state.redeemedCodes.push(code);

    let message = `Validated code! ${describe(reward)}`;
    if (state.redeemedCodes.length >= TOTAL_CODES) {
      message += `\nAll ${TOTAL_CODES} codes found! You saved the digital world!`;
    } else {
      message += `\n${state.redeemedCodes.length}/${TOTAL_CODES} codes found.`;
    }
    return { ok: true, changed: true, message };
  }

  // Stat bonuses a fresh Electromon should keep after a restart (codes are permanent).
  function bonusFromCodes(redeemed) {
    const bonus = { attack: 0, defence: 0, spattack: 0, speed: 0 };
    for (const code of redeemed || []) {
      const r = CODE_REWARDS[normalize(code)];
      if (!r) continue;
      for (const stat of Object.keys(bonus)) bonus[stat] += r[stat] || 0;
    }
    return bonus;
  }

  window.BFCodes = { redeem, bonusFromCodes, total: TOTAL_CODES };
})();
