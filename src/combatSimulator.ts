import { BattleCharacter, BattleMonster, CombatTurn, CombatResult, PlayerAttackResult } from './types';
import { rollAttackDice, rollDefenseDice, rollMonsterDefenseDice } from './gameData';

export function simulateCombat(
  players: BattleCharacter[],
  monster: BattleMonster
): CombatResult {
  const turns: CombatTurn[] = [];
  let turnNumber = 0;
  
  // Create copies to track current state
  const playerStates = players.map(p => ({
    characterId: p.characterId,
    name: p.name,
    bodyPoints: p.currentBodyPoints,
  }));
  
  let monsterBodyPoints = monster.currentBodyPoints;
  
  // Helper function to find the strongest player (highest body points)
  function findStrongestPlayer() {
    const alivePlayers = playerStates.filter(p => p.bodyPoints > 0);
    if (alivePlayers.length === 0) return null;
    
    return alivePlayers.reduce((strongest, current) => {
      return current.bodyPoints > strongest.bodyPoints ? current : strongest;
    });
  }
  
  while (true) {
    turnNumber++;
    
    // Players attack phase - all players attack, monster defends against each separately
    const playerAttacks: PlayerAttackResult[] = [];
    let totalMonsterDamage = 0;
    const alivePlayersAtStart = playerStates.filter(p => p.bodyPoints > 0);
    
    for (const player of alivePlayersAtStart) {
      const playerData = players.find(p => p.characterId === player.characterId)!;
      const attackRoll = rollAttackDice(playerData.attackDice);
      const hits = attackRoll.hits;
      
      // Monster defends against this attack (black shields block for monsters)
      const monsterDefenseRoll = rollMonsterDefenseDice(monster.defenseDice);
      const blocks = monsterDefenseRoll.blocks;
      const damage = Math.max(0, hits - blocks);
      totalMonsterDamage += damage;
      
      playerAttacks.push({
        characterId: player.characterId,
        name: player.name,
        attackRoll: attackRoll,
        hits: hits,
        monsterDefenseRoll: monsterDefenseRoll,
        monsterBlocks: blocks,
        damageDealt: damage,
      });
    }
    
    // Apply total damage to monster
    monsterBodyPoints = Math.max(0, monsterBodyPoints - totalMonsterDamage);
    
    // Check if monster is defeated
    if (monsterBodyPoints <= 0) {
      turns.push({
        turnNumber,
        playerAttacks,
        monsterAttack: { 
          attackRoll: { dice: [], hits: 0, blocks: 0 }, 
          hits: 0 
        },
        playerDefenses: [],
        playerBodyPoints: playerStates.map(p => ({
          characterId: p.characterId,
          name: p.name,
          bodyPoints: p.bodyPoints,
        })),
        monsterBodyPoints: 0,
      });
      
      return {
        turns,
        winner: 'players',
        isComplete: true,
      };
    }
    
    // Monster attacks the strongest player only
    const strongestPlayer = findStrongestPlayer();
    let monsterAttackRoll = { dice: [] as string[], hits: 0, blocks: 0 };
    let monsterHits = 0;
    let targetPlayerId: string | undefined;
    const playerDefenses: Array<{
      characterId: string;
      name: string;
      defenseRoll: { dice: string[]; hits: number; blocks: number };
      blocks: number;
      damageTaken: number;
    }> = [];
    
    if (strongestPlayer) {
      targetPlayerId = strongestPlayer.characterId;
      monsterAttackRoll = rollAttackDice(monster.attackDice);
      monsterHits = monsterAttackRoll.hits;
      
      // Only the strongest player defends (white shields block for players)
      const playerData = players.find(p => p.characterId === strongestPlayer.characterId)!;
      const defenseRoll = rollDefenseDice(playerData.defenseDice);
      const blocks = defenseRoll.blocks;
      const damage = Math.max(0, monsterHits - blocks);
      strongestPlayer.bodyPoints = Math.max(0, strongestPlayer.bodyPoints - damage);
      
      playerDefenses.push({
        characterId: strongestPlayer.characterId,
        name: strongestPlayer.name,
        defenseRoll: defenseRoll,
        blocks: blocks,
        damageTaken: damage,
      });
    }
    
    // Check if all players are defeated
    const alivePlayers = playerStates.filter(p => p.bodyPoints > 0);
    if (alivePlayers.length === 0) {
      turns.push({
        turnNumber,
        playerAttacks,
        monsterAttack: { 
          attackRoll: monsterAttackRoll, 
          hits: monsterHits,
          target: targetPlayerId,
        },
        playerDefenses,
        playerBodyPoints: playerStates.map(p => ({
          characterId: p.characterId,
          name: p.name,
          bodyPoints: p.bodyPoints,
        })),
        monsterBodyPoints,
      });
      
      return {
        turns,
        winner: 'monster',
        isComplete: true,
      };
    }
    
    // Record turn
    turns.push({
      turnNumber,
      playerAttacks,
      monsterAttack: { 
        attackRoll: monsterAttackRoll, 
        hits: monsterHits,
        target: targetPlayerId,
      },
      playerDefenses,
      playerBodyPoints: playerStates.map(p => ({
        characterId: p.characterId,
        name: p.name,
        bodyPoints: p.bodyPoints,
      })),
      monsterBodyPoints,
    });
    
    // Safety check to prevent infinite loops
    if (turnNumber > 100) {
      return {
        turns,
        winner: null,
        isComplete: false,
      };
    }
  }
}
