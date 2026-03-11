interface StoryPanelProps {
  chapterId: string;
  storyNode: string;
}

function StoryPanel({ chapterId, storyNode }: StoryPanelProps) {
  return (
    <section className="panel">
      <h2>剧情进度</h2>
      <p>当前章节：{chapterId === "ch1" ? "第一章" : "第二章"}</p>
      <p>剧情节点：{storyNode}</p>
      {storyNode === "ch2_completed" && <p>第三章入口已解锁</p>}
    </section>
  );
}

export default StoryPanel;
