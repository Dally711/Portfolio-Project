function ModeSelector({ mode, disabled, onModeChange }) {
  return (
    // The select input controls which set of game rules is active.
    <div>
      <label className="form-label fw-semibold" htmlFor="mode-selector">
        Game Mode
      </label>
      {/* Mode selection is disabled during an active game to avoid rule changes mid-round. */}
      <select
        id="mode-selector"
        className="form-select"
        value={mode}
        disabled={disabled}
        onChange={(event) => onModeChange(event.target.value)}
      >
        <option value="order">Sequence Mode</option>
        <option value="pattern">Pattern Mode</option>
      </select>
    </div>
  );
}

export default ModeSelector;
