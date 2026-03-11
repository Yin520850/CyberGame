import { useState } from "react";
import type { CGEntry } from "../../game/chapter/scene";

interface CGGalleryProps {
  entries: CGEntry[];
  unlockedIds: string[];
}

function CGGallery({ entries, unlockedIds }: CGGalleryProps) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewEntry = entries.find((entry) => entry.id === previewId) ?? null;

  return (
    <section className="panel">
      <h2>CG 回放</h2>
      <div className="cg-grid">
        {entries.map((entry) => {
          const unlocked = unlockedIds.includes(entry.id);

          return (
            <article key={entry.id} className="cg-card">
              <p className="cg-title">{entry.title}</p>
              {unlocked ? (
                <button type="button" onClick={() => setPreviewId(entry.id)}>
                  回放 {entry.title}
                </button>
              ) : (
                <p>{entry.title}（未解锁）</p>
              )}
            </article>
          );
        })}
      </div>
      {previewEntry && (
        <div className="cg-preview-mask" role="dialog" aria-modal="true">
          <div className="cg-preview panel">
            <h3>{previewEntry.title}</h3>
            <img src={previewEntry.previewImage} alt={previewEntry.title} />
            <button type="button" onClick={() => setPreviewId(null)}>
              关闭回放
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CGGallery;
