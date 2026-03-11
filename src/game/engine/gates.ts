import type { ChapterGateDefinition, ClueState } from "../types";

export interface GateSnapshot {
  clueStates: Record<string, ClueState>;
}

const CLUE_LEVEL: Record<ClueState, number> = {
  undiscovered: 0,
  discovered: 1,
  resolved: 2,
  used_in_reasoning: 3
};

function hasAtLeast(
  clueStates: Record<string, ClueState>,
  clueId: string,
  minimum: ClueState
): boolean {
  const current = clueStates[clueId] ?? "undiscovered";
  return CLUE_LEVEL[current] >= CLUE_LEVEL[minimum];
}

export function evaluateGate(
  gate: ChapterGateDefinition,
  snapshot: GateSnapshot
): boolean {
  const requiredDiscovered = gate.requiredClues.every((id) =>
    hasAtLeast(snapshot.clueStates, id, "discovered")
  );
  if (!requiredDiscovered) {
    return false;
  }

  const requiredResolved = (gate.requiredResolvedClues ?? []).every((id) =>
    hasAtLeast(snapshot.clueStates, id, "resolved")
  );
  if (!requiredResolved) {
    return false;
  }

  return (gate.requiredUsedClues ?? []).every((id) =>
    hasAtLeast(snapshot.clueStates, id, "used_in_reasoning")
  );
}
