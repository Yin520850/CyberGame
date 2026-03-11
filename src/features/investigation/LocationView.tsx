import type { ClueDefinition, ClueState } from "../../game/types";

interface LocationViewProps {
  locationLabel: string;
  clues: ClueDefinition[];
  clueStates: Record<string, ClueState>;
  onCollectClue: (clueId: string) => void;
  hiddenRevealed: boolean;
  onRevealHidden: () => void;
}

function isCollected(state: ClueState | undefined): boolean {
  return !!state && state !== "undiscovered";
}

function LocationView({
  locationLabel,
  clues,
  clueStates,
  onCollectClue,
  hiddenRevealed,
  onRevealHidden
}: LocationViewProps) {
  const hiddenClues = clues.filter((clue) => clue.hidden);
  const visibleClues = clues.filter((clue) => !clue.hidden || hiddenRevealed);

  return (
    <section className="panel">
      <h2>{locationLabel}</h2>
      {visibleClues.length === 0 ? (
        <p>该地点暂无可交互线索。</p>
      ) : (
        <div className="clue-list">
          {visibleClues.map((clue) => {
            const collected = isCollected(clueStates[clue.id]);
            return (
              <button
                key={clue.id}
                type="button"
                className="clue-btn"
                onClick={() => onCollectClue(clue.id)}
                disabled={collected}
              >
                {collected ? `已采集 ${clue.name}` : `采集 ${clue.name}`}
              </button>
            );
          })}
        </div>
      )}
      {hiddenClues.length > 0 && !hiddenRevealed && (
        <button type="button" onClick={onRevealHidden}>
          搜索隐藏线索
        </button>
      )}
    </section>
  );
}

export default LocationView;
