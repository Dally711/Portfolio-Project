import Controls from './Controls';
import ModeSelector from './ModeSelector';

function SetupPanel({ mode, disabled, onModeChange, onStart }) {
  return (
    <section className="app-panel setup-panel">
      <h2>Game Setup</h2>
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
