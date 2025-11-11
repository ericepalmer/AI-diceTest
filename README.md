# HeroQuest Testing Suite

A web-based testing suite for HeroQuest combat simulation. This application allows you to:

- Manage your characters with custom stats, armor, and weapons
- Set up battles with selected characters and monsters from the base game and First Light expansion
- Run automated combat simulations with dice rolls
- View detailed turn-by-turn combat results in a table
- Try the same battle again with new dice rolls

## Features

- **Character Management**: Create and customize characters with body points, attack dice, defense dice, armor, and weapons
- **Quick Templates**: Pre-configured character templates (Barbarian, Dwarf, Elf, Wizard)
- **Monster Selection**: Choose from base game and First Light expansion monsters
- **Combat Simulation**: Automated dice rolling and combat resolution
- **Detailed Results**: Turn-by-turn combat log showing all attacks, defenses, and damage
- **Health Management**: Set current health for characters and monsters before battle

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

## Usage

1. **Add Characters**: Click "Add Character" and fill in the character details, or use a quick template
2. **Start Battle**: Click "Start Battle" when you have at least one character
3. **Configure Battle**: Select which characters will fight, set their current health, and choose a monster
4. **View Results**: The combat simulation runs automatically and displays results in a table
5. **Try Again**: Click "Try Again" to rerun the same battle with new dice rolls, or "New Battle" to start over

## Combat Rules

- Each turn, all players attack first, then the monster attacks
- Players roll attack dice (skulls = hits)
- Monster defends against each player attack separately
- Monster then attacks all players with one attack
- Each player defends individually against the monster's attack
- Combat continues until all players or the monster is defeated

## Monsters Included

### Base Game
- Goblin, Orc, Fimir, Chaos Warrior, Gargoyle
- Skeleton, Zombie, Mummy, Sorcerer

### First Light Expansion
- Frost Giant, Ice Troll, Snow Tiger
- Frost Skeleton, Ice Wolf, Frozen Warrior, Frost Wraith

## Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

