function Controls({ onStart, onRestart, gameStarted }) {
  return (
    // The control bar holds the main actions for beginning or resetting a game.
    <div className="d-flex gap-2">
      {/* Start is disabled after the game begins to avoid starting twice. */}
      <button
        type="button"
        className="btn btn-primary flex-fill"
        onClick={onStart}
        disabled={gameStarted}
      >
        Start
      </button>
      {/* Restart clears the current game and returns the player to setup. */}
      <button
        type="button"
        className="btn btn-outline-danger flex-fill"
        onClick={onRestart}
      >
        Restart
      </button>
    </div>
  );
}

export default Controls;
