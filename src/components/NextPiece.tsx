import { Piece } from '../types/tetris';

interface NextPieceProps {
  piece: Piece | null;
}

export default function NextPiece({ piece }: NextPieceProps) {
  if (!piece) return null;

  const renderGrid = () => {
    const grid = Array(4).fill(null).map(() => Array(4).fill(false));
    
    // Center the piece in the 4x4 grid
    const offsetRow = Math.floor((4 - piece.shape.length) / 2);
    const offsetCol = Math.floor((4 - piece.shape[0].length) / 2);
    
    piece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          grid[rowIndex + offsetRow][colIndex + offsetCol] = true;
        }
      });
    });

    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-6 h-6 border border-gray-700 ${
              cell ? `tetris-block-${piece.type}` : 'bg-gray-800'
            }`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2 text-center">Next</h3>
      <div className="flex flex-col items-center justify-center">
        {renderGrid()}
      </div>
    </div>
  );
}