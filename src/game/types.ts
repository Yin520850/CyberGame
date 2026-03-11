export type GameMode = "story" | "investigation";

export type ClueState =
  | "undiscovered"
  | "discovered"
  | "resolved"
  | "used_in_reasoning";

export type ClueTransitionAction = "discover" | "resolve" | "use";

export interface ClueDefinition {
  id: string;
  name: string;
  locationId: string;
  hidden?: boolean;
}

export interface ChapterGateDefinition {
  id: string;
  requiredClues: string[];
  requiredResolvedClues?: string[];
  requiredUsedClues?: string[];
}

export interface ChapterDefinition {
  id: string;
  title: string;
  coreLocations: string[];
  sideLocations: string[];
  clues: ClueDefinition[];
  gates: ChapterGateDefinition[];
}
