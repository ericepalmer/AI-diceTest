import { useState } from 'react';
import { Character, BattleCharacter, BattleMonster, CombatResult } from './types';
import { MONSTERS } from './gameData';
import { simulateCombat } from './combatSimulator';
import CharacterManager from './components/CharacterManager';
import BattleSetup from './components/BattleSetup';
import CombatLog from './components/CombatLog';
import './App.css';

type AppState = 'characters' | 'battle' | 'results';

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [appState, setAppState] = useState<AppState>('characters');
  const [battlePlayers, setBattlePlayers] = useState<BattleCharacter[]>([]);
  const [battleMonster, setBattleMonster] = useState<BattleMonster | null>(null);
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null);

  const handleStartBattle = (players: BattleCharacter[], monster: BattleMonster) => {
    setBattlePlayers(players);
    setBattleMonster(monster);
    setAppState('battle');
    
    // Run combat simulation
    const result = simulateCombat(players, monster);
    setCombatResult(result);
    setAppState('results');
  };

  const handleReset = () => {
    setBattlePlayers([]);
    setBattleMonster(null);
    setCombatResult(null);
    setAppState('characters');
  };

  const handleTryAgain = () => {
    if (battleMonster && battlePlayers.length > 0) {
      // Rerun combat simulation with same characters and monster (new dice rolls)
      const result = simulateCombat(battlePlayers, battleMonster);
      setCombatResult(result);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>HeroQuest Testing Suite</h1>
      </header>
      
      <main className="app-main">
        {appState === 'characters' && (
          <CharacterManager
            characters={characters}
            onCharactersChange={setCharacters}
            onStartBattle={() => setAppState('battle')}
          />
        )}
        
        {appState === 'battle' && (
          <BattleSetup
            characters={characters}
            monsters={MONSTERS}
            onStartBattle={handleStartBattle}
            onBack={() => setAppState('characters')}
          />
        )}
        
        {appState === 'results' && combatResult && battleMonster && (
          <CombatLog
            result={combatResult}
            monster={battleMonster}
            players={battlePlayers}
            onReset={handleReset}
            onTryAgain={handleTryAgain}
          />
        )}
      </main>
    </div>
  );
}

export default App;

