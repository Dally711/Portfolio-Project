function SoundToggle({ soundEnabled, onSoundToggle }) {
  return (
    // This switch lets the player enable or disable all game sounds.
    <div className="form-check form-switch sound-toggle">
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
  );
}

export default SoundToggle;
