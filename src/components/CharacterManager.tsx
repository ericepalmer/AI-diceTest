import { useState } from 'react';
import { Character } from '../types';
import { CHARACTER_TEMPLATES } from '../gameData';

interface CharacterManagerProps {
  characters: Character[];
  onCharactersChange: (characters: Character[]) => void;
  onStartBattle: () => void;
}

export default function CharacterManager({
  characters,
  onCharactersChange,
  onStartBattle,
}: CharacterManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Character>>({
    name: '',
    maxBodyPoints: 6,
    attackDice: 2,
    defenseDice: 2,
    armor: '',
    weapons: '',
  });

  const handleAdd = () => {
    if (!formData.name) return;
    
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: formData.name,
      maxBodyPoints: formData.maxBodyPoints || 6,
      attackDice: formData.attackDice || 2,
      defenseDice: formData.defenseDice || 2,
      armor: formData.armor || '',
      weapons: formData.weapons || '',
    };
    
    onCharactersChange([...characters, newCharacter]);
    resetForm();
  };

  const handleEdit = (character: Character) => {
    setEditingId(character.id);
    setFormData(character);
    setIsAdding(true);
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name) return;
    
    const updated = characters.map(c =>
      c.id === editingId
        ? {
            ...c,
            name: formData.name!,
            maxBodyPoints: formData.maxBodyPoints || 6,
            attackDice: formData.attackDice || 2,
            defenseDice: formData.defenseDice || 2,
            armor: formData.armor || '',
            weapons: formData.weapons || '',
          }
        : c
    );
    
    onCharactersChange(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onCharactersChange(characters.filter(c => c.id !== id));
  };

  const handleTemplateSelect = (templateKey: keyof typeof CHARACTER_TEMPLATES) => {
    const template = CHARACTER_TEMPLATES[templateKey];
    setFormData({
      ...formData,
      name: template.name,
      maxBodyPoints: template.maxBodyPoints,
      attackDice: template.attackDice,
      defenseDice: template.defenseDice,
    });
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      maxBodyPoints: 6,
      attackDice: 2,
      defenseDice: 2,
      armor: '',
      weapons: '',
    });
  };

  return (
    <div>
      <section>
        <h2>Character Management</h2>
        
        {characters.length === 0 && !isAdding && (
          <div className="empty-state">
            <p>No characters added yet. Add your first character to begin.</p>
          </div>
        )}

        {characters.length > 0 && (
          <div className="character-list">
            {characters.map(character => (
              <div key={character.id} className="character-card">
                <h3>{character.name}</h3>
                <p>Body Points: {character.maxBodyPoints}</p>
                <p>Attack Dice: {character.attackDice}</p>
                <p>Defense Dice: {character.defenseDice}</p>
                {character.armor && <p>Armor: {character.armor}</p>}
                {character.weapons && <p>Weapons: {character.weapons}</p>}
                <div className="button-group">
                  <button onClick={() => handleEdit(character)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(character.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isAdding ? (
          <button onClick={() => setIsAdding(true)}>Add Character</button>
        ) : (
          <div>
            <h3>{editingId ? 'Edit Character' : 'Add Character'}</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Quick Templates:</p>
              <div className="button-group">
                {Object.keys(CHARACTER_TEMPLATES).map(key => (
                  <button
                    key={key}
                    className="secondary"
                    onClick={() => handleTemplateSelect(key as keyof typeof CHARACTER_TEMPLATES)}
                  >
                    {CHARACTER_TEMPLATES[key as keyof typeof CHARACTER_TEMPLATES].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Character name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Max Body Points</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxBodyPoints}
                  onChange={e => setFormData({ ...formData, maxBodyPoints: parseInt(e.target.value) || 6 })}
                />
              </div>

              <div className="form-group">
                <label>Attack Dice</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.attackDice}
                  onChange={e => setFormData({ ...formData, attackDice: parseInt(e.target.value) || 2 })}
                />
              </div>

              <div className="form-group">
                <label>Defense Dice</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.defenseDice}
                  onChange={e => setFormData({ ...formData, defenseDice: parseInt(e.target.value) || 2 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Armor (optional)</label>
              <input
                type="text"
                value={formData.armor}
                onChange={e => setFormData({ ...formData, armor: e.target.value })}
                placeholder="e.g., Chainmail, Plate Armor"
              />
            </div>

            <div className="form-group">
              <label>Weapons (optional)</label>
              <input
                type="text"
                value={formData.weapons}
                onChange={e => setFormData({ ...formData, weapons: e.target.value })}
                placeholder="e.g., Longsword, Battle Axe"
              />
            </div>

            <div className="button-group">
              <button onClick={editingId ? handleUpdate : handleAdd}>
                {editingId ? 'Update' : 'Add'} Character
              </button>
              <button className="secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {characters.length > 0 && (
          <div className="button-group" style={{ marginTop: '1.5rem' }}>
            <button onClick={onStartBattle}>Start Battle</button>
          </div>
        )}
      </section>
    </div>
  );
}

