interface TaskItem {
  id: string;
  text: string;
  done: boolean;
}

interface TaskTrackerProps {
  items: TaskItem[];
}

function TaskTracker({ items }: TaskTrackerProps) {
  return (
    <section className="panel">
      <h2>当前任务</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.done ? "已完成" : "进行中"}：{item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

export type { TaskItem };
export default TaskTracker;
