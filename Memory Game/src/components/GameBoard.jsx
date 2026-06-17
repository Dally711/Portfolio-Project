
import Tile from './Tile';

function GameBoard({ tiles, activeTiles, clickedTiles, disabled, onTileClick }) {

    return (

        <div className="game-board row g-3 mx-auto">
        {tiles.map((tile) => (
            <div className="col-4" key={tile}>
            <Tile
                isActive={activeTiles.includes(tile)}
                isSelected={clickedTiles.includes(tile)}
                disabled={disabled}
                onClick={() => onTileClick(tile)}
            />
            </div>
        ))}
        </div>
    )
}

export default GameBoard;
