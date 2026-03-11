import type { SceneFrame } from "../../game/chapter/scene";

interface GalSceneProps {
  chapterLabel: string;
  chapterTitle: string;
  frame: SceneFrame;
  showTransition: boolean;
}

function GalScene({ chapterLabel, chapterTitle, frame, showTransition }: GalSceneProps) {
  return (
    <section className="gal-scene panel">
      <h2>剧情演出</h2>
      <div
        className="gal-stage"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(9,14,24,0.24), rgba(9,14,24,0.66)), url(${frame.background})`
        }}
      >
        {showTransition && (
          <div className="chapter-transition" aria-live="polite">
            <p>{chapterLabel}</p>
            <h3>{chapterTitle}</h3>
          </div>
        )}
        <div className="character-layer" aria-hidden="true">
          {frame.leftCharacter && (
            <img
              className="character left"
              src={frame.leftCharacter.sprite}
              alt={`${frame.leftCharacter.name}-${frame.leftCharacter.expression}`}
            />
          )}
          {frame.rightCharacter && (
            <img
              className="character right"
              src={frame.rightCharacter.sprite}
              alt={`${frame.rightCharacter.name}-${frame.rightCharacter.expression}`}
            />
          )}
        </div>
        <div className="dialogue-box">
          <p className="speaker">{frame.dialogueSpeaker}</p>
          <p className="line">{frame.dialogueLine}</p>
          <p className="subtitle">{frame.chapterSubtitle}</p>
        </div>
      </div>
    </section>
  );
}

export default GalScene;
