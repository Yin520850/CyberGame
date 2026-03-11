import type { ClueDefinition, ClueState } from "../../game/types";

interface LocationViewProps {
  locationLabel: string;
  clues: ClueDefinition[];
  clueStates: Record<string, ClueState>;
  onCollectClue: (clueId: string) => void;
}

function isCollected(state: ClueState | undefined): boolean {
  return !!state && state !== "undiscovered";
}

function LocationView({
  locationLabel,
  clues,
  clueStates,
  onCollectClue
}: LocationViewProps) {
  return (
    <section className="panel">
      <h2>{locationLabel}</h2>
      {clues.length === 0 ? (
        <p>该地点暂无可交互线索。</p>
      ) : (
        <div className="clue-list">
          {clues.map((clue) => {
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
    </section>
  );
}

export default LocationView;
