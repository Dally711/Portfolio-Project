import {
  LEVELS_PER_GRID_SIZE,
  MAX_SPEED_BONUS_TIME,
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
export function calculateRoundScore({ level, gridSize, mode, timeTaken }) {
  const modeMultiplier = mode === 'order' ? 2 : 1;
  const basePoints = level * gridSize * modeMultiplier;
  const speedBonus = Math.max(0, MAX_SPEED_BONUS_TIME - timeTaken) * gridSize;

  return Math.round(basePoints + speedBonus);
}
