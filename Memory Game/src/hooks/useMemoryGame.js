import { useRef, useState } from 'react';
import {
  CLEAR_SELECTION_DELAY,
  NEXT_ROUND_DELAY,
  SHOW_DELAY,
  START_COUNTDOWN_SECONDS,
  STEP_DELAY,
} from '../constants/gameConfig';
import {
  calculateRoundScore,
  createTiles,
  getGridSize,
  getRandomPattern,
  getRandomSequence,
} from '../utils/gameUtils';
import useSound from './useSound';

const RECORD_STORAGE_KEY = 'memoryGameRecords';
const DEFAULT_RECORDS = {
  order: 0,
  pattern: 0,
};

// Loads separate records for Sequence Mode and Pattern Mode from the browser.
function getSavedRecords() {
  const savedRecords = window.localStorage.getItem(RECORD_STORAGE_KEY);
  // Keeps compatibility with the older single-record storage key.
  const oldRecord = Number(window.localStorage.getItem('memoryGameRecord') || 0);

  if (!savedRecords) {
    return {
      order: oldRecord,
      pattern: 0,
    };
  }

  return {
    ...DEFAULT_RECORDS,
    ...JSON.parse(savedRecords),
  };
}

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
  // recordScores stores the best score for each game mode.
  const [recordScores, setRecordScores] = useState(getSavedRecords);
  const [recap, setRecap] = useState(null);
  const [countdown, setCountdown] = useState(null);
  // timersRef keeps every pending timeout so Restart can cancel animations.
  const timersRef = useRef([]);
  // These refs keep the latest score data available inside timer callbacks.
  const scoreRef = useRef(0);
  const roundScoresRef = useRef([]);
  const recordScoresRef = useRef(recordScores);
  const turnStartTimeRef = useRef(null);
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
        turnStartTimeRef.current = Date.now();
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
      turnStartTimeRef.current = Date.now();
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
    turnStartTimeRef.current = null;
    scoreRef.current = 0;
    roundScoresRef.current = [];
    setCountdown(START_COUNTDOWN_SECONDS);
    setLevel(1);
    setScore(0);
    setRecap(null);
    setGameStarted(true);
    setGameOver(false);
    setMessage(`Starting in ${START_COUNTDOWN_SECONDS}...`);
    setStatus('ready');

    for (let secondsLeft = START_COUNTDOWN_SECONDS - 1; secondsLeft > 0; secondsLeft -= 1) {
      addTimer(() => {
        setCountdown(secondsLeft);
        setMessage(`Starting in ${secondsLeft}...`);
      }, (START_COUNTDOWN_SECONDS - secondsLeft) * 1000);
    }

    addTimer(() => {
      setCountdown(null);
      setSequence(firstSequence);
      setMessage('Watch carefully.');
      setStatus('watching');
      showRound(firstSequence);
    }, START_COUNTDOWN_SECONDS * 1000);
  }

  // Returns the game to the initial pre-start state.
  function restartGame() {
    clearTimers();
    setSequence([]);
    setPlayerSequence([]);
    setClickedTiles([]);
    turnStartTimeRef.current = null;
    scoreRef.current = 0;
    roundScoresRef.current = [];
    setCountdown(null);
    setActiveTiles([]);
    setLevel(1);
    setScore(0);
    setRecap(null);
    setGameStarted(false);
    setGameOver(false);
    setIsShowing(false);
    setMessage('Choose a mode and start the game.');
    setStatus('ready');
  }

  // Routes the click to the correct validation rule for the selected mode.
  function handleTileClick(tile) {
    if (!gameStarted || isShowing || gameOver || countdown !== null) {
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
    const timeTaken = turnStartTimeRef.current
      ? (Date.now() - turnStartTimeRef.current) / 1000
      : 0;
    const pointsEarned = calculateRoundScore({
      level,
      gridSize,
      timeTaken,
    });
    const roundScore = {
      round: roundScoresRef.current.length + 1,
      gridSize,
      level,
      points: pointsEarned,
      timeTaken,
    };

    // Save the completed round so the recap can show a score breakdown.
    roundScoresRef.current = [...roundScoresRef.current, roundScore];
    setScore((currentScore) => {
      const nextScore = currentScore + pointsEarned;
      scoreRef.current = nextScore;
      return nextScore;
    });
    setIsShowing(true);
    setMessage(`Correct. +${pointsEarned} points.`);
    setStatus('success');
    turnStartTimeRef.current = null;
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
    turnStartTimeRef.current = null;
    setIsShowing(false);
    setGameOver(true);
    setMessage(gameOverMessage);
    setStatus('error');
    createRecap();
    playTone(120, 0.35);
  }

  // Creates the final score summary after the game ends.
  function createRecap() {
    const finalScore = scoreRef.current;
    // Compare only against the record for the mode the player just played.
    const currentModeRecord = recordScoresRef.current[mode];
    const isNewRecord = finalScore > currentModeRecord;
    const nextRecordScores = {
      ...recordScoresRef.current,
      [mode]: isNewRecord ? finalScore : currentModeRecord,
    };

    if (isNewRecord) {
      // Persist the updated per-mode records in the browser.
      recordScoresRef.current = nextRecordScores;
      setRecordScores(nextRecordScores);
      window.localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(nextRecordScores));
    }

    setRecap({
      finalScore,
      isNewRecord,
      levelReached: level,
      mode,
      recordScore: nextRecordScores[mode],
      roundsCompleted: roundScoresRef.current.length,
      roundScores: roundScoresRef.current,
    });
  }

  // Changing modes resets the current game so the rules stay consistent.
  function handleModeChange(nextMode) {
    restartGame();
    setMode(nextMode);
  }

  return {
    activeTiles,
    clickedTiles,
    countdown,
    gameOver,
    gameStarted,
    gridSize,
    handleModeChange,
    handleTileClick,
    isShowing,
    level,
    message,
    mode,
    recap,
    recordScores,
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
