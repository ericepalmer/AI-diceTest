import { Monster, DiceRoll } from './types';

// HeroQuest base game and First Light expansion monsters
export const MONSTERS: Monster[] = [
  // Base Game Monsters
  { id: 'goblin', name: 'Goblin', bodyPoints: 1, attackDice: 2, defenseDice: 1 },
  { id: 'orc', name: 'Orc', bodyPoints: 1, attackDice: 2, defenseDice: 1 },
  { id: 'fimir', name: 'Fimir', bodyPoints: 2, attackDice: 3, defenseDice: 2 },
  { id: 'chaos-warrior', name: 'Chaos Warrior', bodyPoints: 3, attackDice: 3, defenseDice: 2 },
  { id: 'gargoyle', name: 'Gargoyle', bodyPoints: 3, attackDice: 3, defenseDice: 3 },
  { id: 'skeleton', name: 'Skeleton', bodyPoints: 1, attackDice: 2, defenseDice: 2 },
  { id: 'zombie', name: 'Zombie', bodyPoints: 1, attackDice: 1, defenseDice: 2 },
  { id: 'mummy', name: 'Mummy', bodyPoints: 3, attackDice: 3, defenseDice: 3 },
  { id: 'sorcerer', name: 'Sorcerer', bodyPoints: 4, attackDice: 4, defenseDice: 3 },
  
  // First Light Expansion Monsters
  { id: 'frost-giant', name: 'Frost Giant', bodyPoints: 5, attackDice: 4, defenseDice: 3 },
  { id: 'ice-troll', name: 'Ice Troll', bodyPoints: 4, attackDice: 3, defenseDice: 3 },
  { id: 'snow-tiger', name: 'Snow Tiger', bodyPoints: 2, attackDice: 3, defenseDice: 2 },
  { id: 'frost-skeleton', name: 'Frost Skeleton', bodyPoints: 2, attackDice: 2, defenseDice: 2 },
  { id: 'ice-wolf', name: 'Ice Wolf', bodyPoints: 2, attackDice: 3, defenseDice: 1 },
  { id: 'frozen-warrior', name: 'Frozen Warrior', bodyPoints: 3, attackDice: 3, defenseDice: 3 },
  { id: 'frost-wraith', name: 'Frost Wraith', bodyPoints: 4, attackDice: 4, defenseDice: 2 },
];

// Standard character templates (can be customized)
export const CHARACTER_TEMPLATES = {
  barbarian: { name: 'Barbarian', maxBodyPoints: 8, attackDice: 3, defenseDice: 2 },
  dwarf: { name: 'Dwarf', maxBodyPoints: 7, attackDice: 2, defenseDice: 2 },
  elf: { name: 'Elf', maxBodyPoints: 6, attackDice: 2, defenseDice: 2 },
  wizard: { name: 'Wizard', maxBodyPoints: 4, attackDice: 1, defenseDice: 2 },
};

// HeroQuest combat dice:
// - Skull = hit (on attack) or nothing (on defense)
// - White Shield = block (on defense) or nothing (on attack)
// - Black Shield = nothing
// Each die has: 2 skulls, 2 white shields, 2 black shields

export function rollAttackDice(numDice: number): DiceRoll {
  // Returns dice roll results with individual die values
  const dice: string[] = [];
  let hits = 0;
  
  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * 6);
    // 0-1 = skull (hit), 2-3 = white shield, 4-5 = black shield
    if (roll < 2) {
      dice.push('skull');
      hits++;
    } else if (roll >= 2 && roll < 4) {
      dice.push('white-shield');
    } else {
      dice.push('black-shield');
    }
  }
  
  return {
    dice,
    hits,
    blocks: 0,
  };
}

export function rollDefenseDice(numDice: number): DiceRoll {
  // Returns dice roll results for PLAYER defense (white shields block)
  const dice: string[] = [];
  let blocks = 0;
  
  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * 6);
    // 0-1 = skull, 2-3 = white shield (block for players), 4-5 = black shield
    if (roll < 2) {
      dice.push('skull');
    } else if (roll >= 2 && roll < 4) {
      dice.push('white-shield');
      blocks++;
    } else {
      dice.push('black-shield');
    }
  }
  
  return {
    dice,
    hits: 0,
    blocks,
  };
}

export function rollMonsterDefenseDice(numDice: number): DiceRoll {
  // Returns dice roll results for MONSTER defense (black shields block)
  const dice: string[] = [];
  let blocks = 0;
  
  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * 6);
    // 0-1 = skull, 2-3 = white shield, 4-5 = black shield (block for monsters)
    if (roll < 2) {
      dice.push('skull');
    } else if (roll >= 2 && roll < 4) {
      dice.push('white-shield');
    } else {
      dice.push('black-shield');
      blocks++;
    }
  }
  
  return {
    dice,
    hits: 0,
    blocks,
  };
}

