import { useState } from 'react';
import { Character, BattleCharacter, BattleMonster, Monster } from '../types';

interface BattleSetupProps {
  characters: Character[];
  monsters: Monster[];
  onStartBattle: (players: BattleCharacter[], monster: BattleMonster) => void;
  onBack: () => void;
}

export default function BattleSetup({
  characters,
  monsters,
  onStartBattle,
  onBack,
}: BattleSetupProps) {
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    characters.map(c => c.id)
  );
  const [characterHealth, setCharacterHealth] = useState<Record<string, number>>(
    Object.fromEntries(characters.map(c => [c.id, c.maxBodyPoints]))
  );
  const [characterAttackDice, setCharacterAttackDice] = useState<Record<string, number>>(
    Object.fromEntries(characters.map(c => [c.id, c.attackDice]))
  );
  const [characterDefenseDice, setCharacterDefenseDice] = useState<Record<string, number>>(
    Object.fromEntries(characters.map(c => [c.id, c.defenseDice]))
  );
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>('');
  const [monsterHealth, setMonsterHealth] = useState<number>(0);
  const [monsterAttackDice, setMonsterAttackDice] = useState<number>(0);
  const [monsterDefenseDice, setMonsterDefenseDice] = useState<number>(0);

  const handleCharacterToggle = (characterId: string) => {
    if (selectedCharacterIds.includes(characterId)) {
      setSelectedCharacterIds(selectedCharacterIds.filter(id => id !== characterId));
    } else {
      setSelectedCharacterIds([...selectedCharacterIds, characterId]);
      const character = characters.find(c => c.id === characterId);
      if (character) {
        if (!characterHealth[characterId]) {
          setCharacterHealth({
            ...characterHealth,
            [characterId]: character.maxBodyPoints,
          });
        }
        if (!characterAttackDice[characterId]) {
          setCharacterAttackDice({
            ...characterAttackDice,
            [characterId]: character.attackDice,
          });
        }
        if (!characterDefenseDice[characterId]) {
          setCharacterDefenseDice({
            ...characterDefenseDice,
            [characterId]: character.defenseDice,
          });
        }
      }
    }
  };

  const handleCharacterHealthChange = (characterId: string, health: number) => {
    setCharacterHealth({
      ...characterHealth,
      [characterId]: Math.max(0, health),
    });
  };

  const handleCharacterAttackDiceChange = (characterId: string, dice: number) => {
    setCharacterAttackDice({
      ...characterAttackDice,
      [characterId]: Math.max(1, Math.min(10, dice)),
    });
  };

  const handleCharacterDefenseDiceChange = (characterId: string, dice: number) => {
    setCharacterDefenseDice({
      ...characterDefenseDice,
      [characterId]: Math.max(1, Math.min(10, dice)),
    });
  };

  const handleMonsterSelect = (monsterId: string) => {
    setSelectedMonsterId(monsterId);
    const monster = monsters.find(m => m.id === monsterId);
    if (monster) {
      setMonsterHealth(monster.bodyPoints);
      setMonsterAttackDice(monster.attackDice);
      setMonsterDefenseDice(monster.defenseDice);
    }
  };

  const handleStartBattle = () => {
    if (selectedCharacterIds.length === 0 || !selectedMonsterId) {
      alert('Please select at least one character and a monster.');
      return;
    }

    const battlePlayers: BattleCharacter[] = selectedCharacterIds
      .map(id => {
        const character = characters.find(c => c.id === id);
        if (!character) return null;
        return {
          characterId: character.id,
          name: character.name,
          currentBodyPoints: characterHealth[character.id] || character.maxBodyPoints,
          maxBodyPoints: character.maxBodyPoints,
          attackDice: characterAttackDice[character.id] || character.attackDice,
          defenseDice: characterDefenseDice[character.id] || character.defenseDice,
        };
      })
      .filter((p): p is BattleCharacter => p !== null);

    const monster = monsters.find(m => m.id === selectedMonsterId);
    if (!monster) return;

    const battleMonster: BattleMonster = {
      monsterId: monster.id,
      name: monster.name,
      currentBodyPoints: monsterHealth || monster.bodyPoints,
      maxBodyPoints: monster.bodyPoints,
      attackDice: monsterAttackDice || monster.attackDice,
      defenseDice: monsterDefenseDice || monster.defenseDice,
    };

    onStartBattle(battlePlayers, battleMonster);
  };

  return (
    <div>
      <section>
        <h2>Battle Setup</h2>

        <div className="battle-setup-grid">
          {/* Characters Section */}
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#2c3e50' }}>Characters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {characters.map(character => {
                const isSelected = selectedCharacterIds.includes(character.id);
                return (
                  <div
                    key={character.id}
                    style={{
                      border: `2px solid ${isSelected ? '#3498db' : '#ddd'}`,
                      borderRadius: '6px',
                      padding: '0.75rem',
                      backgroundColor: isSelected ? '#f0f8ff' : '#f8f9fa',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: isSelected ? '0.75rem' : '0' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCharacterToggle(character.id)}
                        style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                      />
                      <label
                        style={{
                          flex: 1,
                          margin: 0,
                          cursor: 'pointer',
                          fontWeight: 600,
                          color: '#2c3e50',
                        }}
                        onClick={() => handleCharacterToggle(character.id)}
                      >
                        {character.name}
                      </label>
                    </div>
                    {isSelected && (
                      <div className="character-stats-grid" style={{ marginTop: '0.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#7f8c8d' }}>
                            Health
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <input
                              type="number"
                              min="0"
                              max={character.maxBodyPoints}
                              value={characterHealth[character.id] || character.maxBodyPoints}
                              onChange={e =>
                                handleCharacterHealthChange(character.id, parseInt(e.target.value) || 0)
                              }
                              style={{
                                width: '50px',
                                padding: '0.25rem',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                              }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                              / {character.maxBodyPoints}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#7f8c8d' }}>
                            Attack Dice
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={characterAttackDice[character.id] || character.attackDice}
                            onChange={e =>
                              handleCharacterAttackDiceChange(character.id, parseInt(e.target.value) || 1)
                            }
                            style={{
                              width: '60px',
                              padding: '0.25rem',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#7f8c8d' }}>
                            Defense Dice
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={characterDefenseDice[character.id] || character.defenseDice}
                            onChange={e =>
                              handleCharacterDefenseDiceChange(character.id, parseInt(e.target.value) || 1)
                            }
                            style={{
                              width: '60px',
                              padding: '0.25rem',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monster Section */}
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#2c3e50' }}>Monster</h3>
            <div className="form-group">
              <label>Select Monster</label>
              <select
                value={selectedMonsterId}
                onChange={e => handleMonsterSelect(e.target.value)}
                style={{ marginBottom: '1rem' }}
              >
                <option value="">Choose a monster...</option>
                {monsters.map(monster => (
                  <option key={monster.id} value={monster.id}>
                    {monster.name} (BP: {monster.bodyPoints}, A: {monster.attackDice}, D: {monster.defenseDice})
                  </option>
                ))}
              </select>
            </div>

            {selectedMonsterId && (
              <div
                style={{
                  border: '2px solid #e74c3c',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  backgroundColor: '#fff5f5',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#2c3e50' }}>
                  {monsters.find(m => m.id === selectedMonsterId)?.name}
                </div>
                <div className="monster-stats-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#7f8c8d' }}>
                      Health
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <input
                        type="number"
                        min="0"
                        max={monsters.find(m => m.id === selectedMonsterId)?.bodyPoints || 0}
                        value={monsterHealth}
                        onChange={e => setMonsterHealth(parseInt(e.target.value) || 0)}
                        style={{
                          width: '50px',
                          padding: '0.25rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                        }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                        / {monsters.find(m => m.id === selectedMonsterId)?.bodyPoints || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#7f8c8d' }}>
                      Attack Dice
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={monsterAttackDice}
                      onChange={e => setMonsterAttackDice(parseInt(e.target.value) || 1)}
                      style={{
                        width: '60px',
                        padding: '0.25rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#7f8c8d' }}>
                      Defense Dice
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={monsterDefenseDice}
                      onChange={e => setMonsterDefenseDice(parseInt(e.target.value) || 1)}
                      style={{
                        width: '60px',
                        padding: '0.25rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="button-group" style={{ marginTop: '1.5rem' }}>
          <button onClick={handleStartBattle} disabled={selectedCharacterIds.length === 0 || !selectedMonsterId}>
            Start Battle
          </button>
          <button className="secondary" onClick={onBack}>
            Back to Characters
          </button>
        </div>
      </section>
    </div>
  );
}
