

function Tile({ isActive, isSelected, disabled, onClick }) {
  // Keep the tile lit when it is being shown or after the player clicks it.
  const tileClass = isActive || isSelected ? 'tile-active' : 'tile-idle';

  return (
    <button
      className={`tile btn w-100 ${tileClass}`}
      disabled={disabled}
      onClick={onClick}
    ></button>
  );
}

export default Tile;
