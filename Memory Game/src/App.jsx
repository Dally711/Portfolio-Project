import './App.css';
import Controls from './components/Controls';
import GameBoard from './components/GameBoard';
import GameHeader from './components/GameHeader';
import ModeSelector from './components/ModeSelector';
import ScoreBoard from './components/ScoreBoard';
import useMemoryGame from './hooks/useMemoryGame';

function App() {
  const game = useMemoryGame();

  return (
    <main className="app-shell py-5">
      <div className="container">
        <section className="game-panel mx-auto">
          <div className="d-flex flex-column gap-4">
            <GameHeader
              soundEnabled={game.soundEnabled}
              onSoundToggle={game.setSoundEnabled}
            />

            <p className="text-secondary mb-0">
              Memorize the highlighted tiles, then repeat them back in the selected mode.
            </p>

            <ModeSelector
              mode={game.mode}
              disabled={game.gameStarted && !game.gameOver}
              onModeChange={game.handleModeChange}
            />

            <ScoreBoard
              level={game.level}
              score={game.score}
              message={game.message}
              status={game.status}
            />

            <GameBoard
              tiles={game.tiles}
              gridSize={game.gridSize}
              activeTiles={game.activeTiles}
              clickedTiles={game.clickedTiles}
              disabled={!game.gameStarted || game.isShowing || game.gameOver}
              onTileClick={game.handleTileClick}
            />

            <Controls
              gameStarted={game.gameStarted}
              onStart={game.startGame}
              onRestart={game.restartGame}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
