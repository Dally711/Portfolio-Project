function ModeSelector({ mode, disabled, onModeChange }) {
  return (
    // The select input controls which set of game rules is active.
    <div className="mode-section">
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

      <label className="instructions fw-semibold">Instructions</label>


      <p className="form-text"> 
        {mode === "order" ?( //If mode = order text 1 if not, text 2
          <> 
            Memorize the sequence in the <b>exact order</b> shown
          </>
        ) : (
          <>
            Memorize all highlighted tiles that appear <b>at the same time</b> and select them in <b>any order</b>
          </>
          
        )}
      </p>
    </div>
  );
}

export default ModeSelector;
