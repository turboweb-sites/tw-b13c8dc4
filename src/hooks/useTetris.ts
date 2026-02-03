import { useState, useEffect, useCallback, useRef } from 'react';
import { Board, Piece, GameState, TetrominoType } from '../types/tetris';
import {
  createEmptyBoard,
  createPiece,
  isValidMove,
  rotatePieceMatrix,
  mergePieceToBoard,
  clearFullRows,
  getRandomPiece,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../utils/tetris';

export default function useTetris() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    piece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    isPlaying: false,
  });

  const dropTimeRef = useRef<number>(1000);
  const lastDropRef = useRef<number>(0);

  // Initialize game
  useEffect(() => {
    if (gameState.isPlaying && !gameState.piece && !gameState.gameOver) {
      const firstPiece = createPiece(getRandomPiece());
      const nextPiece = createPiece(getRandomPiece());
      
      setGameState(prev => ({
        ...prev,
        piece: firstPiece,
        nextPiece: nextPiece,
      }));
    }
  }, [gameState.isPlaying, gameState.piece, gameState.gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const gameLoop = (currentTime: number) => {
      if (currentTime - lastDropRef.current > dropTimeRef.current) {
        lastDropRef.current = currentTime;
        movePiece('down');
      }
      
      if (gameState.isPlaying && !gameState.gameOver) {
        requestAnimationFrame(gameLoop);
      }
    };

    requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.gameOver, gameState.level]);

  // Update drop speed based on level
  useEffect(() => {
    dropTimeRef.current = Math.max(100, 1000 - (gameState.level - 1) * 100);
  }, [gameState.level]);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    setGameState(prev => {
      if (!prev.piece || prev.gameOver || !prev.isPlaying) return prev;

      const newPosition = { ...prev.piece.position };
      
      switch (direction) {
        case 'left':
          newPosition.col -= 1;
          break;
        case 'right':
          newPosition.col += 1;
          break;
        case 'down':
          newPosition.row += 1;
          break;
      }

      if (isValidMove(prev.board, prev.piece.shape, newPosition)) {
        return {
          ...prev,
          piece: {
            ...prev.piece,
            position: newPosition,
          },
        };
      } else if (direction === 'down') {
        // Piece can't move down, lock it in place
        const mergedBoard = mergePieceToBoard(prev.board, prev.piece);
        const { clearedBoard, linesCleared } = clearFullRows(mergedBoard);
        
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        const newScore = prev.score + (linesCleared * 100 * newLevel);
        
        // Create new piece
        const newPiece = prev.nextPiece;
        const newNextPiece = createPiece(getRandomPiece());
        
        // Check if new piece can be placed
        if (newPiece && !isValidMove(clearedBoard, newPiece.shape, newPiece.position)) {
          return {
            ...prev,
            board: clearedBoard,
            gameOver: true,
            isPlaying: false,
          };
        }

        return {
          ...prev,
          board: clearedBoard,
          piece: newPiece,
          nextPiece: newNextPiece,
          score: newScore,
          lines: newLines,
          level: newLevel,
        };
      }

      return prev;
    });
  }, []);

  const rotatePiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.piece || prev.gameOver || !prev.isPlaying) return prev;

      const rotatedShape = rotatePieceMatrix(prev.piece.shape);
      
      if (isValidMove(prev.board, rotatedShape, prev.piece.position)) {
        return {
          ...prev,
          piece: {
            ...prev.piece,
            shape: rotatedShape,
          },
        };
      }

      return prev;
    });
  }, []);

  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.piece || prev.gameOver || !prev.isPlaying) return prev;

      let dropPosition = { ...prev.piece.position };
      let dropDistance = 0;

      while (isValidMove(prev.board, prev.piece.shape, { 
        row: dropPosition.row + 1, 
        col: dropPosition.col 
      })) {
        dropPosition.row++;
        dropDistance++;
      }

      // Add score for hard drop
      const newScore = prev.score + dropDistance * 2;

      // Force the piece to lock immediately
      const mergedBoard = mergePieceToBoard(prev.board, {
        ...prev.piece,
        position: dropPosition,
      });
      const { clearedBoard, linesCleared } = clearFullRows(mergedBoard);
      
      const newLines = prev.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      const totalScore = newScore + (linesCleared * 100 * newLevel);
      
      const newPiece = prev.nextPiece;
      const newNextPiece = createPiece(getRandomPiece());
      
      if (newPiece && !isValidMove(clearedBoard, newPiece.shape, newPiece.position)) {
        return {
          ...prev,
          board: clearedBoard,
          gameOver: true,
          isPlaying: false,
        };
      }

      return {
        ...prev,
        board: clearedBoard,
        piece: newPiece,
        nextPiece: newNextPiece,
        score: totalScore,
        lines: newLines,
        level: newLevel,
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      piece: null,
      nextPiece: null,
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      isPlaying: true,
    });
  }, []);

  return {
    board: gameState.board,
    piece: gameState.piece,
    nextPiece: gameState.nextPiece,
    score: gameState.score,
    lines: gameState.lines,
    level: gameState.level,
    gameOver: gameState.gameOver,
    isPlaying: gameState.isPlaying,
    movePiece,
    rotatePiece,
    dropPiece,
    togglePause,
    resetGame,
  };
}