import SoundToggle from './SoundToggle';

function GameHeader({ soundEnabled, onSoundToggle }) {
  return (
    // Header groups the game title with the sound control.
    <div className="game-header">
      <h1 className="mb-0">Memory Game</h1>
      <SoundToggle soundEnabled={soundEnabled} onSoundToggle={onSoundToggle} />
    </div>
  );
}

export default GameHeader;
