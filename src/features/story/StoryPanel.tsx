import { CHAPTER_LABELS, type ChapterId } from "../../game/chapter/progression";

interface StoryPanelProps {
  chapterId: string;
  storyNode: string;
}

function StoryPanel({ chapterId, storyNode }: StoryPanelProps) {
  return (
    <section className="panel">
      <h2>剧情进度</h2>
      <p>当前章节：{CHAPTER_LABELS[chapterId as ChapterId] ?? chapterId}</p>
      <p>剧情节点：{storyNode}</p>
      {storyNode === "ch2_completed" && <p>第三章入口已解锁</p>}
      {storyNode === "ch3_completed" && <p>第四章入口已解锁</p>}
      {storyNode === "ch4_completed" && <p>第五章入口已解锁</p>}
      {storyNode === "ch5_completed" && <p>全章完结</p>}
    </section>
  );
}

export default StoryPanel;
