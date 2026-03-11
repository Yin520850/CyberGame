interface StoryPanelProps {
  chapterId: string;
  storyNode: string;
}

const CHAPTER_LABELS: Record<string, string> = {
  ch1: "第一章",
  ch2: "第二章",
  ch3: "第三章"
};

function StoryPanel({ chapterId, storyNode }: StoryPanelProps) {
  return (
    <section className="panel">
      <h2>剧情进度</h2>
      <p>当前章节：{CHAPTER_LABELS[chapterId] ?? chapterId}</p>
      <p>剧情节点：{storyNode}</p>
      {storyNode === "ch2_completed" && <p>第三章入口已解锁</p>}
      {storyNode === "ch3_completed" && <p>第四章入口已解锁</p>}
    </section>
  );
}

export default StoryPanel;
