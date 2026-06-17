function Controls({ onStart, onRestart, gameStarted, soundEnabled, onSoundToggle }) {
  return (
    // The control bar holds the main actions for beginning or resetting a game.
    <div className="d-flex flex-column gap-3">
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

      {/* This switch lets the player enable or disable all game sounds. */}
      <div className="form-check form-switch sound-toggle text-start">
        <input
          id="sound-toggle"
          className="form-check-input"
          type="checkbox"
          checked={soundEnabled}
          onChange={(event) => onSoundToggle(event.target.checked)}
        />
        <label className="form-check-label" htmlFor="sound-toggle">
          Sound {soundEnabled ? 'On' : 'Off'}
        </label>
      </div>
    </div>
  );
}

export default Controls;
