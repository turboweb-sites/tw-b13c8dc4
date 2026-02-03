import { Board, Cell, Piece, Position, TetrominoType } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES: Record<TetrominoType, boolean[][]> = {
  I: [
    [true, true, true, true]
  ],
  O: [
    [true, true],
    [true, true]
  ],
  T: [
    [false, true, false],
    [true, true, true]
  ],
  S: [
    [false, true, true],
    [true, true, false]
  ],
  Z: [
    [true, true, false],
    [false, true, true]
  ],
  J: [
    [true, false, false],
    [true, true, true]
  ],
  L: [
    [false, false, true],
    [true, true, true]
  ]
};

export function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(null)
  );
}

export function getRandomPiece(): TetrominoType {
  const pieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return pieces[Math.floor(Math.random() * pieces.length)];
}

export function createPiece(type: TetrominoType): Piece {
  const shape = TETROMINOES[type];
  const col = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
  
  return {
    type,
    shape,
    position: { row: 0, col }
  };
}

export function isValidMove(board: Board, shape: boolean[][], position: Position): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newRow = position.row + row;
        const newCol = position.col + col;
        
        // Check boundaries
        if (newRow < 0 || newRow >= BOARD_HEIGHT || 
            newCol < 0 || newCol >= BOARD_WIDTH) {
          return false;
        }
        
        // Check collision with existing pieces
        if (board[newRow][newCol] !== null) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export function rotatePieceMatrix(shape: boolean[][]): boolean[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: boolean[][] = Array(cols).fill(null).map(() => Array(rows).fill(false));
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotated[col][rows - 1 - row] = shape[row][col];
    }
  }
  
  return rotated;
}

export function mergePieceToBoard(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row]);
  
  piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const boardRow = piece.position.row + rowIndex;
        const boardCol = piece.position.col + colIndex;
        newBoard[boardRow][boardCol] = piece.type;
      }
    });
  });
  
  return newBoard;
}

export function clearFullRows(board: Board): { clearedBoard: Board; linesCleared: number } {
  let clearedBoard = [...board];
  let linesCleared = 0;
  
  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (clearedBoard[row].every(cell => cell !== null)) {
      clearedBoard.splice(row, 1);
      clearedBoard.unshift(Array(BOARD_WIDTH).fill(null));
      linesCleared++;
      row++; // Check the same row again
    }
  }
  
  return { clearedBoard, linesCleared };
}