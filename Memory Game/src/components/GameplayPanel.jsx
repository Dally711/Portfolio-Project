import Controls from './Controls';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';

function GameplayPanel({
  activeTiles,
  clickedTiles,
  countdown,
  disabled,
  gridSize,
  level,
  message,
  onRestart,
  onTileClick,
  score,
  status,
  tiles,
}) {
  return (
    <section className="app-panel gameplay-panel">
      <h2>Gameplay</h2>
      <ScoreBoard level={level} score={score} message={message} status={status} />

      {countdown !== null && (
        <div className="countdown-display" aria-live="polite">
          {countdown}
        </div>
      )}

      <GameBoard
        tiles={tiles}
        gridSize={gridSize}
        activeTiles={activeTiles}
        clickedTiles={clickedTiles}
        disabled={disabled}
        onTileClick={onTileClick}
      />

      <Controls
        onRestart={onRestart}
        showStart={false}
      />
    </section>
  );
}

export default GameplayPanel;
