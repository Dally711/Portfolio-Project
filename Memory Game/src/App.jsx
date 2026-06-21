import './App.css';
import GameplayPanel from './components/GameplayPanel';
import GameHeader from './components/GameHeader';
import RecapPanel from './components/RecapPanel';
import SetupPanel from './components/SetupPanel';
import useMemoryGame from './hooks/useMemoryGame';

function App() {
  const game = useMemoryGame();

  return (
    <main className="app-shell py-5">
      <div className="container">
        <section className="game-panel mx-auto">
          <div className="game-content">
            <GameHeader
              soundEnabled={game.soundEnabled}
              onSoundToggle={game.setSoundEnabled}
            />

            <SetupPanel
              mode={game.mode}
              disabled={game.gameStarted && !game.gameOver}
              onModeChange={game.handleModeChange}
              onStart={game.startGame}
            />

            <GameplayPanel
              activeTiles={game.activeTiles}
              clickedTiles={game.clickedTiles}
              countdown={game.countdown}
              disabled={!game.gameStarted || game.isShowing || game.gameOver}
              gridSize={game.gridSize}
              level={game.level}
              message={game.message}
              onRestart={game.restartGame}
              onTileClick={game.handleTileClick}
              score={game.score}
              status={game.status}
              tiles={game.tiles}
            />

            <RecapPanel
              recap={game.recap}
              onRestart={game.restartGame}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
