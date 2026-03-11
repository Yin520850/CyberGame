interface FinalReportPanelProps {
  visible: boolean;
  onRestart: () => void;
}

function FinalReportPanel({ visible, onRestart }: FinalReportPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <section className="panel">
      <h2>结案摘要</h2>
      <p>账号使用与发布：已确认高远使用夜鸦账号。</p>
      <p>误导行为：存在裁剪传播与线索改名行为。</p>
      <p>责任与修复：需公开说明、道歉并执行修复方案。</p>
      <button type="button" onClick={onRestart}>
        重新开始调查
      </button>
    </section>
  );
}

export default FinalReportPanel;
