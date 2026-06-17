import { useRef, useState } from 'react';
import {
  CLEAR_SELECTION_DELAY,
  NEXT_ROUND_DELAY,
  SHOW_DELAY,
  STEP_DELAY,
} from '../constants/gameConfig';
import {
  createTiles,
  getGridSize,
  getRandomPattern,
  getRandomSequence,
} from '../utils/gameUtils';
import useSound from './useSound';

function useMemoryGame() {
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
  const [status, setStatus] = useState('ready');
  const [gameStarted, setGameStarted] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  // timersRef keeps every pending timeout so Restart can cancel animations.
  const timersRef = useRef([]);
  const { soundEnabled, setSoundEnabled, playTone, playTileSound } = useSound();

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
    setStatus('watching');

    // Pattern Mode lights every tile at the same time.
    if (mode === 'pattern') {
      setActiveTiles(currentSequence);
      currentSequence.forEach((tile) => playTileSound(tile));

      addTimer(() => {
        setActiveTiles([]);
        setIsShowing(false);
        setMessage('Your turn.');
        setStatus('playing');
      }, SHOW_DELAY + currentSequence.length * 180);

      return;
    }

    // Sequence Mode lights one tile at a time in the exact answer order.
    currentSequence.forEach((tile, index) => {
      addTimer(() => {
        setActiveTiles([tile]);
        playTileSound(tile);
      }, index * STEP_DELAY);

      addTimer(() => {
        setActiveTiles([]);
      }, index * STEP_DELAY + SHOW_DELAY);
    });

    addTimer(() => {
      setIsShowing(false);
      setMessage('Your turn.');
      setStatus('playing');
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
    setStatus('watching');
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
    setStatus('ready');
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

  // Sequence Mode checks each click against the same position in the answer.
  function handleSequenceClick(tile) {
    const clickIndex = playerSequence.length;

    if (tile !== sequence[clickIndex]) {
      loseGame('Wrong order. Game over.');
      return;
    }

    const nextPlayerSequence = [...playerSequence, tile];
    setPlayerSequence(nextPlayerSequence);
    setClickedTiles(nextPlayerSequence);
    playTileSound(tile);

    if (nextPlayerSequence.length === sequence.length) {
      const nextLevel = level + 1;
      const nextTiles = createTiles(getGridSize(nextLevel));
      const lastTile = sequence[sequence.length - 1];

      advanceRound(getRandomSequence(nextLevel, nextTiles, lastTile));
    }
  }

  // Pattern Mode checks that the clicked tile belongs to the answer set.
  function handlePatternClick(tile) {
    if (!sequence.includes(tile) || playerSequence.includes(tile)) {
      loseGame('That tile was not in the pattern. Game over.');
      return;
    }

    const nextPlayerSequence = [...playerSequence, tile];
    setPlayerSequence(nextPlayerSequence);
    setClickedTiles(nextPlayerSequence);
    playTileSound(tile);

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
    setStatus('success');
    playTone(620, 0.18);

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
    setStatus('error');
    playTone(120, 0.35);
  }

  // Changing modes resets the current game so the rules stay consistent.
  function handleModeChange(nextMode) {
    restartGame();
    setMode(nextMode);
  }

  return {
    activeTiles,
    clickedTiles,
    gameOver,
    gameStarted,
    gridSize,
    handleModeChange,
    handleTileClick,
    isShowing,
    level,
    message,
    mode,
    restartGame,
    score,
    setSoundEnabled,
    soundEnabled,
    startGame,
    status,
    tiles,
  };
}

export default useMemoryGame;
