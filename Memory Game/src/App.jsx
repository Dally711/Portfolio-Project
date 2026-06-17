import { useRef, useState } from 'react';
import './App.css';
import Controls from './components/Controls';
import GameBoard from './components/GameBoard';
import ModeSelector from './components/ModeSelector';
import ScoreBoard from './components/ScoreBoard';

const STARTING_GRID_SIZE = 3;
const LEVELS_PER_GRID_SIZE = 3;
const SHOW_DELAY = 450;
const STEP_DELAY = 650;
const CLEAR_SELECTION_DELAY = 500; //To wait for the tiles to become gray again before showing the next round.
const NEXT_ROUND_DELAY = 900; // 

// The grid grows every 3 levels: 3x3, then 4x4, then 5x5, etc.
function getGridSize(level) {
  return STARTING_GRID_SIZE + Math.floor((level - 1) / LEVELS_PER_GRID_SIZE);
}

// Creates the tile numbers for the current grid size.
function createTiles(gridSize) {
  return Array.from({ length: gridSize * gridSize }, (_, index) => index + 1);
}

// Returns one random tile number from the current board.
function getRandomTile(tiles) {
  return tiles[Math.floor(Math.random() * tiles.length)];
}

// Creates a pattern with unique random tiles for Pattern Mode.
function getRandomPattern(size, tiles) {
  return [...tiles].sort(() => Math.random() - 0.5).slice(0, size);
}

// Creates a fresh random sequence for Sequence Mode.
function getRandomSequence(size, tiles, excludedFirstTile = null) {
  const sequence = [];

  for (let index = 0; index < size; index += 1) {
    let tile = getRandomTile(tiles);

    if (index === 0 && excludedFirstTile !== null) {
      while (tile === excludedFirstTile) {
        tile = getRandomTile(tiles);
      }
    }

    sequence.push(tile);
  }

  return sequence;
}

function App() {
  // sequence stores the correct answer for the current round.
  const [sequence, setSequence] = useState([]);
  // playerSequence stores the tiles clicked by the player this round.
  const [playerSequence, setPlayerSequence] = useState([]);
  // activeTiles controls which tiles are currently highlighted.
  const [activeTiles, setActiveTiles] = useState([]);
  // clickedTiles controls which player-clicked tiles stay lit on the board.
  const [clickedTiles, setClickedTiles] = useState([]);
  // mode decides whether order matters or only the selected pattern matters.
  const [mode, setMode] = useState('order');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Choose a mode and start the game.');
  const [gameStarted, setGameStarted] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  // timersRef keeps every pending timeout so Restart can cancel animations.
  const timersRef = useRef([]);
  const gridSize = getGridSize(level);
  const tiles = createTiles(gridSize);

  // Stops all pending highlight and next-round timers.
  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  // Adds a timeout and removes it from timersRef after it runs.
  function addTimer(callback, delay) {
    const timer = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((savedTimer) => savedTimer !== timer);
      callback();
    }, delay);

    timersRef.current.push(timer);
  }

  // Shows the current round before the player is allowed to click tiles.
  function showRound(currentSequence) {
    clearTimers();
    setIsShowing(true);
    setPlayerSequence([]);
    setClickedTiles([]);
    setMessage(mode === 'order' ? 'Watch the sequence.' : 'Memorize the pattern.');

    // Pattern Mode lights every tile at the same time.
    if (mode === 'pattern') {  // Wrote "===" instead of "==" because it only chekc value and may convert types automatically
      setActiveTiles(currentSequence);

      addTimer(() => {
        setActiveTiles([]);
        setIsShowing(false);
        setMessage('Your turn.');
      }, SHOW_DELAY + currentSequence.length * 180);

      return;
    }

    // Sequence Mode lights one tile at a time in the exact answer order.
    currentSequence.forEach((tile, index) => {
      addTimer(() => {
        setActiveTiles([tile]);
      }, index * STEP_DELAY);

      addTimer(() => {
        setActiveTiles([]);
      }, index * STEP_DELAY + SHOW_DELAY);
    });

    addTimer(() => {
      setIsShowing(false);
      setMessage('Your turn.');
    }, currentSequence.length * STEP_DELAY);
  }

  // Starts a new game using the currently selected mode.
  function startGame() {
    const startingTiles = createTiles(getGridSize(1));
    const firstSequence = mode === 'order'
      ? getRandomSequence(1, startingTiles)
      : getRandomPattern(1, startingTiles);

    clearTimers();
    setSequence(firstSequence);
    setPlayerSequence([]);
    setClickedTiles([]);
    setLevel(1);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    setMessage('Watch carefully.');
    showRound(firstSequence);
  }

  // Returns the game to the initial pre-start state.
  function restartGame() {
    clearTimers();
    setSequence([]);
    setPlayerSequence([]);
    setClickedTiles([]);
    setActiveTiles([]);
    setLevel(1);
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
    setIsShowing(false);
    setMessage('Choose a mode and start the game.');
  }

  // Routes the click to the correct validation rule for the selected mode.
  function handleTileClick(tile) {
    if (!gameStarted || isShowing || gameOver) {
      return;
    }

    if (mode === 'order') {
      handleSequenceClick(tile);
      return;
    }

    handlePatternClick(tile);
  }

  // SEQUENCE MODE checks each click against the same position in the answer.
  function handleSequenceClick(tile) {
    const clickIndex = playerSequence.length;

    if (tile !== sequence[clickIndex]) {  //If the order is wrong
      loseGame('Wrong order. Game over.');
      return;
    }

    const nextPlayerSequence = [...playerSequence, tile];
    setPlayerSequence(nextPlayerSequence);
    setClickedTiles(nextPlayerSequence);

    if (nextPlayerSequence.length === sequence.length) {    //If the player selected all the corrected tiles in order
      const nextLevel = level + 1;
      const nextTiles = createTiles(getGridSize(nextLevel));
      const lastTile = sequence[sequence.length - 1];
      advanceRound(getRandomSequence(nextLevel, nextTiles, lastTile)); //Advance to the next round
    }
  }

  // PATTERN MODE checks that the clicked tile belongs to the answer set.
  function handlePatternClick(tile) {
    if (!sequence.includes(tile) || playerSequence.includes(tile)) {
      loseGame('That tile was not in the pattern. Game over.');
      return;
    }

    const nextPlayerSequence = [...playerSequence, tile];
    setPlayerSequence(nextPlayerSequence);
    setClickedTiles(nextPlayerSequence);

    if (nextPlayerSequence.length === sequence.length) {
      const nextLevel = level + 1;
      const nextTiles = createTiles(getGridSize(nextLevel));

      advanceRound(getRandomPattern(nextLevel, nextTiles));
    }
  }

  // Moves to the next round and shows the newly generated sequence or pattern.
  function advanceRound(nextSequence) {
    const nextLevel = level + 1;

    setScore((currentScore) => currentScore + 1);
    setIsShowing(true);
    setMessage('Correct. Next round.');

    // Let the player see their final selected tiles before clearing them.
    addTimer(() => {
      setClickedTiles([]);
    }, CLEAR_SELECTION_DELAY);

    // Start the next round only after the board has been cleared for a moment.
    addTimer(() => {
      setLevel(nextLevel);
      setSequence(nextSequence);
      showRound(nextSequence);
    }, NEXT_ROUND_DELAY);
  }

  // Ends the game after an incorrect player click.
  function loseGame(gameOverMessage) {
    clearTimers();
    setActiveTiles([]);
    setClickedTiles([]);
    setIsShowing(false);
    setGameOver(true);
    setMessage(gameOverMessage);
  }

  // Changing modes resets the current game so the rules stay consistent.
  function handleModeChange(nextMode) {
    restartGame();
    setMode(nextMode);
  }

  return (
    <main className="app-shell py-5">
      <div className="container">
        <section className="game-panel mx-auto">
          <div className="d-flex flex-column gap-4">
            {/* Game title and short instruction text. */}
            <div>
              <h1 className="mb-2">Memory Game</h1>
              <p className="text-secondary mb-0">
                Memorize the highlighted tiles, then repeat them back in the selected mode.
              </p>
            </div>

            {/* Lets the player choose between Sequence Mode and Pattern Mode. */}
            <ModeSelector
              mode={mode}
              disabled={gameStarted && !gameOver}
              onModeChange={handleModeChange}
            />

            {/* Displays the current progress and game message. */}
            <ScoreBoard level={level} score={score} message={message} />

            {/* Renders the clickable tile board using the current grid size. */}
            <GameBoard
              tiles={tiles}
              gridSize={gridSize}
              activeTiles={activeTiles}
              clickedTiles={clickedTiles}
              disabled={!gameStarted || isShowing || gameOver}
              onTileClick={handleTileClick}
            />

            {/* Provides the Start and Restart buttons. */}
            <Controls
              gameStarted={gameStarted}
              onStart={startGame}
              onRestart={restartGame}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
