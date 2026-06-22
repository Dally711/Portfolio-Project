import Controls from './Controls';
import ModeSelector from './ModeSelector';
import SoundToggle from './SoundToggle';

function SetupPanel({
  ref,
  mode,
  disabled,
  onModeChange,
  onSoundToggle,
  onStart,
  soundEnabled,
}) {
  return (
    // The header reads this ref to know when the setup panel is moving under the navbar area.
    <section ref={ref} className="app-panel setup-panel">
      <div className="setup-header">
        <h2>Game Setup</h2>
        <SoundToggle soundEnabled={soundEnabled} onSoundToggle={onSoundToggle} />
      </div>

      <p className="intro-text text-secondary mb-0">
        Memorize the highlighted tiles, then repeat them back in the selected mode.
      </p>

      <ModeSelector mode={mode} disabled={disabled} onModeChange={onModeChange} />

      <Controls
        gameStarted={disabled}
        onStart={onStart}
        showRestart={false}
      />
    </section>
  );
}

export default SetupPanel;
