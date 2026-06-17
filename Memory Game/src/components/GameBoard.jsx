
import Tile from './Tile';

function GameBoard({ tiles, gridSize, activeTiles, clickedTiles, disabled, onTileClick }) {

    return (

        <div
            className="game-board mx-auto"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }} //Dynamically sets the number of columns based on the grid size for different board configurations
        >
        {tiles.map((tile) => (
            <Tile
                key={tile}
                //number={tile} If i wanna add numbers
                isActive={activeTiles.includes(tile)}
                isSelected={clickedTiles.includes(tile)}
                disabled={disabled}
                onClick={() => onTileClick(tile)}
            />
        ))}
        </div>
    )
}

export default GameBoard;
