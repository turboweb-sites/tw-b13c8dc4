import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCw, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import Board from './Board';
import NextPiece from './NextPiece';
import Score from './Score';
import Controls from './Controls';
import useTetris from '../hooks/useTetris';

export default function Game() {
  const {
    board,
    piece,
    nextPiece,
    score,
    lines,
    level,
    gameOver,
    isPlaying,
    movePiece,
    rotatePiece,
    dropPiece,
    togglePause,
    resetGame
  } = useTetris();

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || !isPlaying) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePiece('left');
          break;
        case 'ArrowRight':
          movePiece('right');
          break;
        case 'ArrowDown':
          movePiece('down');
          break;
        case 'ArrowUp':
        case ' ':
          rotatePiece();
          break;
        case 'Enter':
          dropPiece();
          break;
        case 'p':
        case 'P':
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, isPlaying, movePiece, rotatePiece, dropPiece, togglePause]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || gameOver || !isPlaying) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 50) {
        movePiece('right');
      } else if (deltaX < -50) {
        movePiece('left');
      }
    } else {
      // Vertical swipe
      if (deltaY > 50) {
        movePiece('down');
      } else if (deltaY < -50) {
        rotatePiece();
      }
    }

    setTouchStart(null);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 max-w-4xl w-full">
      <h1 className="text-4xl font-bold text-center mb-6 text-cyan-400">TETRIS</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Game Board */}
        <div 
          className="md:col-span-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Board board={board} piece={piece} />
          
          {/* Mobile Controls */}
          <div className="md:hidden mt-4">
            <Controls
              onMove={movePiece}
              onRotate={rotatePiece}
              onDrop={dropPiece}
              disabled={gameOver || !isPlaying}
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Score */}
          <Score score={score} lines={lines} level={level} />

          {/* Next Piece */}
          <NextPiece piece={nextPiece} />

          {/* Game Controls */}
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            {!gameOver ? (
              <button
                onClick={togglePause}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {score === 0 ? 'Start' : 'Resume'}
                  </>
                )}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-xl font-bold text-red-400 mb-3">Game Over!</p>
                <button
                  onClick={resetGame}
                  className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <RotateCw className="w-5 h-5" />
                  New Game
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="hidden md:block bg-gray-700 rounded-lg p-4 text-sm">
            <h3 className="font-semibold mb-2">Controls:</h3>
            <div className="space-y-1 text-gray-300">
              <p>← → : Move</p>
              <p>↓ : Soft drop</p>
              <p>↑ / Space : Rotate</p>
              <p>Enter : Hard drop</p>
              <p>P : Pause</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}