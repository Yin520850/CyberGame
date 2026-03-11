interface EvidenceBoardProps {
  unlocked: boolean;
  entries: string[];
}

function EvidenceBoard({ unlocked, entries }: EvidenceBoardProps) {
  return (
    <section className="panel">
      <h2>时间线面板</h2>
      {unlocked ? (
        <>
          <p>时间线面板已解锁</p>
          <ul>
            {entries.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>时间线面板未解锁</p>
      )}
    </section>
  );
}

export default EvidenceBoard;
