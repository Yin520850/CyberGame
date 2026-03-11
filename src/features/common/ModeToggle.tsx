type Mode = "story" | "investigation";

interface ModeToggleProps {
  mode: Mode;
  onToggle: () => void;
}

function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  const nextLabel = mode === "story" ? "侦查模式" : "剧情模式";

  return (
    <button className="mode-toggle" type="button" onClick={onToggle}>
      切换到{nextLabel}
    </button>
  );
}

export default ModeToggle;
