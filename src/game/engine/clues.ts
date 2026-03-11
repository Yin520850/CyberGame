import type { ClueState, ClueTransitionAction } from "../types";

const TRANSITIONS: Record<ClueState, Partial<Record<ClueTransitionAction, ClueState>>> = {
  undiscovered: {
    discover: "discovered"
  },
  discovered: {
    resolve: "resolved"
  },
  resolved: {
    use: "used_in_reasoning"
  },
  used_in_reasoning: {}
};

export function advanceClueState(
  current: ClueState,
  action: ClueTransitionAction
): ClueState {
  const next = TRANSITIONS[current][action];
  if (!next) {
    throw new Error(`Illegal clue transition: ${current} -> ${action}`);
  }
  return next;
}
