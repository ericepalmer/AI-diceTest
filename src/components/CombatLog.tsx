import {
  CombatResult,
  BattleMonster,
  BattleCharacter,
  DiceRoll,
} from "../types";

interface CombatLogProps {
  result: CombatResult;
  monster: BattleMonster;
  players: BattleCharacter[];
  onReset: () => void;
  onTryAgain: () => void;
}

// Helper function to format dice roll display
function formatDiceRoll(diceRoll: DiceRoll): string {
  if (diceRoll.dice.length === 0) return "—";

  const diceSymbols = diceRoll.dice.map((die) => {
    if (die === "skull") return "⚔";
    if (die === "white-shield") return "🛡";
    if (die === "black-shield") return "⬛";
    return "?";
  });

  return `[${diceSymbols.join(", ")}]`;
}

// Helper function to format dice roll with text labels
function formatDiceRollDetailed(diceRoll: DiceRoll): string {
  if (diceRoll.dice.length === 0) return "—";

  const diceLabels = diceRoll.dice.map((die) => {
    if (die === "skull") return "Skull";
    if (die === "white-shield") return "White Shield";
    if (die === "black-shield") return "Black Shield";
    return "?";
  });

  return diceLabels.join(", ");
}

export default function CombatLog({
  result,
  monster,
  players,
  onReset,
  onTryAgain,
}: CombatLogProps) {
  return (
    <div>
      <section>
        <h2>Combat Results</h2>

        <div
          className={`combat-result ${
            result.winner === "players"
              ? "winner-players"
              : result.winner === "monster"
              ? "winner-monster"
              : ""
          }`}>
          {result.winner === "players" && (
            <p>Victory! The players defeated {monster.name}!</p>
          )}
          {result.winner === "monster" && (
            <p>Defeat! {monster.name} defeated all players!</p>
          )}
          {result.winner === null && (
            <p>Combat ended without a clear winner (safety limit reached).</p>
          )}
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Turn</th>
                <th>Player Attacks vs Monster Defense</th>
                <th>Monster Attack vs Player Defense</th>
                <th>Body Points</th>
              </tr>
            </thead>
            <tbody>
              {result.turns.map((turn) => (
                <tr key={turn.turnNumber}>
                  <td>
                    <strong>{turn.turnNumber}</strong>
                  </td>
                  <td>
                    {turn.playerAttacks.length > 0 ? (
                      turn.playerAttacks.map((attack) => (
                        <div
                          key={attack.characterId}
                          style={{
                            marginBottom: "1rem",
                            padding: "0.75rem",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "4px",
                            border: "1px solid #dee2e6",
                          }}>
                          {/* Player Attack */}
                          <div
                            style={{
                              marginBottom: "0.75rem",
                              paddingBottom: "0.75rem",
                              borderBottom: "2px solid #dee2e6",
                            }}>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "1rem",
                                marginBottom: "0.5rem",
                                color: "#2c3e50",
                              }}>
                              {attack.name} Attacks
                            </div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                marginBottom: "0.25rem",
                              }}>
                              Attack Dice: {formatDiceRoll(attack.attackRoll)}
                            </div>
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "#7f8c8d",
                                marginBottom: "0.25rem",
                              }}>
                              {formatDiceRollDetailed(attack.attackRoll)}
                            </div>
                            <div
                              style={{
                                fontWeight: 600,
                                color: attack.hits > 0 ? "#27ae60" : "#7f8c8d",
                                marginTop: "0.5rem",
                              }}>
                              {attack.hits} hit{attack.hits !== 1 ? "s" : ""}
                            </div>
                          </div>

                          {/* Monster Defense */}
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "1rem",
                                marginBottom: "0.5rem",
                                color: "#856404",
                              }}>
                              {monster.name} Defends
                            </div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                marginBottom: "0.25rem",
                              }}>
                              Defense Dice:{" "}
                              {formatDiceRoll(attack.monsterDefenseRoll)}
                            </div>
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "#7f8c8d",
                                marginBottom: "0.25rem",
                              }}>
                              {formatDiceRollDetailed(
                                attack.monsterDefenseRoll
                              )}
                            </div>
                            <div
                              style={{
                                marginBottom: "0.25rem",
                                marginTop: "0.5rem",
                              }}>
                              <span style={{ fontWeight: 600 }}>
                                {attack.monsterBlocks} block
                                {attack.monsterBlocks !== 1 ? "s" : ""} (black
                                shields)
                              </span>
                            </div>
                            <div>
                              <span
                                style={{
                                  fontWeight: 600,
                                  color:
                                    attack.damageDealt > 0
                                      ? "#e74c3c"
                                      : "#27ae60",
                                  fontSize: "1rem",
                                }}>
                                {attack.damageDealt} damage dealt
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: "#7f8c8d" }}>No attacks</span>
                    )}
                  </td>
                  <td>
                    {turn.monsterAttack.hits > 0 ||
                    turn.monsterAttack.attackRoll.dice.length > 0 ? (
                      <div
                        style={{
                          padding: "0.75rem",
                          backgroundColor: "#fff3cd",
                          borderRadius: "4px",
                          border: "1px solid #ffc107",
                        }}>
                        {/* Monster Attack */}
                        <div
                          style={{
                            marginBottom: "0.75rem",
                            paddingBottom: "0.75rem",
                            borderBottom: "2px solid #ffc107",
                          }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              marginBottom: "0.5rem",
                              color: "#856404",
                            }}>
                            {monster.name} Attacks
                            {turn.monsterAttack.target && (
                              <span
                                style={{
                                  fontSize: "0.85rem",
                                  marginLeft: "0.5rem",
                                  color: "#856404",
                                }}>
                                (Target:{" "}
                                {
                                  players.find(
                                    (p) =>
                                      p.characterId ===
                                      turn.monsterAttack.target
                                  )?.name
                                }
                                )
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              marginBottom: "0.25rem",
                            }}>
                            Attack Dice:{" "}
                            {formatDiceRoll(turn.monsterAttack.attackRoll)}
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#7f8c8d",
                              marginBottom: "0.25rem",
                            }}>
                            {formatDiceRollDetailed(
                              turn.monsterAttack.attackRoll
                            )}
                          </div>
                          <div
                            style={{
                              fontWeight: 600,
                              color:
                                turn.monsterAttack.hits > 0
                                  ? "#e74c3c"
                                  : "#7f8c8d",
                              marginTop: "0.5rem",
                            }}>
                            {turn.monsterAttack.hits} hit
                            {turn.monsterAttack.hits !== 1 ? "s" : ""}
                          </div>
                        </div>

                        {/* Player Defense */}
                        {turn.playerDefenses.length > 0 ? (
                          turn.playerDefenses.map((defense) => (
                            <div key={defense.characterId}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                  marginBottom: "0.5rem",
                                  color: "#2c3e50",
                                }}>
                                {defense.name} Defends
                              </div>
                              <div
                                style={{
                                  fontSize: "0.9rem",
                                  marginBottom: "0.25rem",
                                }}>
                                Defense Dice:{" "}
                                {formatDiceRoll(defense.defenseRoll)}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#7f8c8d",
                                  marginBottom: "0.25rem",
                                }}>
                                {formatDiceRollDetailed(defense.defenseRoll)}
                              </div>
                              <div
                                style={{
                                  marginBottom: "0.25rem",
                                  marginTop: "0.5rem",
                                }}>
                                <span style={{ fontWeight: 600 }}>
                                  {defense.blocks} block
                                  {defense.blocks !== 1 ? "s" : ""} (white
                                  shields)
                                </span>
                              </div>
                              <div>
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color:
                                      defense.damageTaken > 0
                                        ? "#e74c3c"
                                        : "#27ae60",
                                    fontSize: "1rem",
                                  }}>
                                  {defense.damageTaken} damage taken
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: "#7f8c8d" }}>No defense</div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: "#7f8c8d" }}>—</span>
                    )}
                  </td>
                  <td>
                    <div
                      style={{
                        marginBottom: "0.75rem",
                        padding: "0.5rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                      }}>
                      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                        Monster:
                      </div>
                      <div
                        style={{
                          color:
                            turn.monsterBodyPoints > 0 ? "#27ae60" : "#e74c3c",
                          fontWeight: 600,
                        }}>
                        {turn.monsterBodyPoints} / {monster.maxBodyPoints}
                      </div>
                    </div>
                    {turn.playerBodyPoints.map((bp) => (
                      <div
                        key={bp.characterId}
                        style={{
                          marginBottom: "0.75rem",
                          padding: "0.5rem",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "4px",
                        }}>
                        <div
                          style={{
                            fontWeight: 600,
                            marginBottom: "0.25rem",
                          }}>
                          {bp.name}:
                        </div>
                        <div
                          style={{
                            color: bp.bodyPoints > 0 ? "#27ae60" : "#e74c3c",
                            fontWeight: 600,
                          }}>
                          {bp.bodyPoints} /{" "}
                          {players.find((p) => p.characterId === bp.characterId)
                            ?.maxBodyPoints || 0}
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: "#e7f3ff",
            borderRadius: "4px",
            fontSize: "0.85rem",
          }}>
          <strong>Dice Legend:</strong> ⚔ = Skull (Hit), 🛡 = White Shield (Block
          for Players), ⬛ = Black Shield (Block for Monsters, Nothing for
          Players)
        </div>

        <div className="button-group" style={{ marginTop: "1.5rem" }}>
          <button onClick={onTryAgain}>Try Again</button>
          <button className="secondary" onClick={onReset}>
            New Battle
          </button>
        </div>
      </section>
    </div>
  );
}
