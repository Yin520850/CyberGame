import { useMemo, useState } from "react";

interface JudgementQuizProps {
  onSubmit: (selectedReasons: string[]) => void;
}

const REASONS = [
  "时间信息不完整",
  "图片不等于最终方案",
  "聊天记录缺少上下文",
  "用户名神秘",
  "陈小北语气着急",
  "队长身份最可疑"
];

function JudgementQuiz({ onSubmit }: JudgementQuizProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggleReason = (reason: string) => {
    setSelected((prev) =>
      prev.includes(reason)
        ? prev.filter((item) => item !== reason)
        : [...prev, reason]
    );
  };

  return (
    <section className="panel">
      <h2>证据判断</h2>
      <p>选择三项不能直接证明陈小北泄密的理由：</p>
      <div className="quiz-list">
        {REASONS.map((reason) => (
          <label key={reason} className="quiz-item">
            <input
              type="checkbox"
              checked={selectedSet.has(reason)}
              onChange={() => toggleReason(reason)}
            />
            {reason}
          </label>
        ))}
      </div>
      <button type="button" onClick={() => onSubmit(selected)}>
        提交判断
      </button>
    </section>
  );
}

export const CH1_CORRECT_REASONS = new Set<string>([
  "时间信息不完整",
  "图片不等于最终方案",
  "聊天记录缺少上下文"
]);

export default JudgementQuiz;
