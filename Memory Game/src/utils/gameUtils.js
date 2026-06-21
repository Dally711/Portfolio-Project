import {
  BASE_SCORE_DECAY_TIME,
  EXTRA_DECAY_TIME_PER_GRID_SIZE,
  EXTRA_DECAY_TIME_PER_LEVEL,
  LEVELS_PER_GRID_SIZE,
  MAX_ROUND_SCORE,
  MIN_ROUND_SCORE,
  STARTING_GRID_SIZE,
} from '../constants/gameConfig';

// The grid grows every 3 levels: 3x3, then 4x4, then 5x5, etc.
export function getGridSize(level) {
  return STARTING_GRID_SIZE + Math.floor((level - 1) / LEVELS_PER_GRID_SIZE);
}

// Creates the tile numbers for the current grid size.
export function createTiles(gridSize) {
  return Array.from({ length: gridSize * gridSize }, (_, index) => index + 1);
}

// Returns one random tile number from the current board.
export function getRandomTile(tiles) {
  return tiles[Math.floor(Math.random() * tiles.length)];
}

// Creates a pattern with unique random tiles for Pattern Mode.
export function getRandomPattern(size, tiles) {
  return [...tiles].sort(() => Math.random() - 0.5).slice(0, size);
}

// Creates a fresh random sequence for Sequence Mode.
export function getRandomSequence(size, tiles, excludedFirstTile = null) {
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

// Calculates round points from difficulty and answer speed.
export function calculateRoundScore({ level, gridSize, timeTaken }) {
  const scoreRange = MAX_ROUND_SCORE - MIN_ROUND_SCORE;
  const decayTime = BASE_SCORE_DECAY_TIME
    + (level - 1) * EXTRA_DECAY_TIME_PER_LEVEL
    + (gridSize - STARTING_GRID_SIZE) * EXTRA_DECAY_TIME_PER_GRID_SIZE;
  const timeScoreRatio = Math.exp(-timeTaken / decayTime);

  return Math.round(MIN_ROUND_SCORE + scoreRange * timeScoreRatio);
}
