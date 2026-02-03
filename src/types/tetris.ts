export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Cell = TetrominoType | null;

export type Board = Cell[][];

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  type: TetrominoType;
  shape: boolean[][];
  position: Position;
}

export interface GameState {
  board: Board;
  piece: Piece | null;
  nextPiece: Piece | null;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPlaying: boolean;
}