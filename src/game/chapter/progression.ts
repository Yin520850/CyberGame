export type ChapterId = "ch1" | "ch2" | "ch3" | "ch4" | "ch5";

export const CHAPTER_LABELS: Record<ChapterId, string> = {
  ch1: "第一章",
  ch2: "第二章",
  ch3: "第三章",
  ch4: "第四章",
  ch5: "第五章"
};

export const STORY_LEVEL: Record<string, number> = {
  ch1_start: 0,
  ch1_completed: 1,
  ch2_completed: 2,
  ch3_completed: 3,
  ch4_completed: 4,
  ch5_completed: 5
};

export function isStoryAtLeast(storyNode: string, minimumNode: string): boolean {
  return (STORY_LEVEL[storyNode] ?? 0) >= (STORY_LEVEL[minimumNode] ?? 0);
}

export function canAccessChapter(
  currentChapterId: string,
  storyNode: string,
  targetChapterId: ChapterId
): boolean {
  if (currentChapterId === targetChapterId) {
    return true;
  }

  if (targetChapterId === "ch1") {
    return true;
  }
  if (targetChapterId === "ch2") {
    return isStoryAtLeast(storyNode, "ch1_completed");
  }
  if (targetChapterId === "ch3") {
    return isStoryAtLeast(storyNode, "ch2_completed");
  }
  if (targetChapterId === "ch4") {
    return isStoryAtLeast(storyNode, "ch3_completed");
  }

  return isStoryAtLeast(storyNode, "ch4_completed");
}
