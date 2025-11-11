export interface Character {
  id: string;
  name: string;
  maxBodyPoints: number;
  attackDice: number;
  defenseDice: number;
  armor: string;
  weapons: string;
}

export interface Monster {
  id: string;
  name: string;
  bodyPoints: number;
  attackDice: number;
  defenseDice: number;
}

export interface BattleCharacter {
  characterId: string;
  name: string;
  currentBodyPoints: number;
  maxBodyPoints: number;
  attackDice: number;
  defenseDice: number;
}

export interface BattleMonster {
  monsterId: string;
  name: string;
  currentBodyPoints: number;
  maxBodyPoints: number;
  attackDice: number;
  defenseDice: number;
}

export interface DiceRoll {
  dice: string[]; // Array of die results: 'skull', 'white-shield', 'black-shield'
  hits: number; // For attack: number of skulls
  blocks: number; // For defense: number of blocks (white shields for players, black shields for monsters)
}

export interface PlayerAttackResult {
  characterId: string;
  name: string;
  attackRoll: DiceRoll;
  hits: number;
  monsterDefenseRoll: DiceRoll;
  monsterBlocks: number;
  damageDealt: number;
}

export interface CombatTurn {
  turnNumber: number;
  playerAttacks: PlayerAttackResult[];
  monsterAttack: { 
    attackRoll: DiceRoll;
    hits: number;
    target?: string; // Character ID of the target
  };
  playerDefenses: { 
    characterId: string; 
    name: string; 
    defenseRoll: DiceRoll;
    blocks: number; 
    damageTaken: number;
  }[];
  playerBodyPoints: { characterId: string; name: string; bodyPoints: number }[];
  monsterBodyPoints: number;
}

export interface CombatResult {
  turns: CombatTurn[];
  winner: 'players' | 'monster' | null;
  isComplete: boolean;
}

