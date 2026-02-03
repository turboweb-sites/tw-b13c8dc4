import { Board as BoardType, Piece } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/tetris';

interface BoardProps {
  board: BoardType;
  piece: Piece | null;
}

export default function Board({ board, piece }: BoardProps) {
  const renderCell = (row: number, col: number) => {
    let cellType = board[row][col];
    
    // Check if current piece occupies this cell
    if (piece) {
      const relRow = row - piece.position.row;
      const relCol = col - piece.position.col;
      
      if (
        relRow >= 0 &&
        relRow < piece.shape.length &&
        relCol >= 0 &&
        relCol < piece.shape[0].length &&
        piece.shape[relRow][relCol]
      ) {
        cellType = piece.type;
      }
    }
    
    return (
      <div
        key={`${row}-${col}`}
        className={`w-full h-full tetris-cell ${
          cellType ? `tetris-block-${cellType}` : 'bg-gray-900'
        }`}
      />
    );
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div
        className="grid gap-0 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`,
          width: '300px',
          height: '600px',
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => renderCell(rowIndex, colIndex))
        )}
      </div>
    </div>
  );
}