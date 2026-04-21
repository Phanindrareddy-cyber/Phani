import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../types';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || !gameStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          onScoreUpdate(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, gameStarted, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    ctx.shadowBlur = 10;
    snake.forEach((segment, index) => {
      ctx.shadowColor = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillStyle = index === 0 ? '#00ffff' : '#ff00ff';
      
      // Glitch effect: offset occasional segments
      const offset = Math.random() > 0.98 ? (Math.random() - 0.5) * 4 : 0;
      
      ctx.fillRect(
        segment.x * cellSize + 1 + offset,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    // Draw food
    ctx.shadowColor = '#ffff00';
    ctx.fillStyle = '#ffff00';
    // Flicker food
    if (Math.random() > 0.1) {
      ctx.fillRect(
        food.x * cellSize + 4,
        food.y * cellSize + 4,
        cellSize - 8,
        cellSize - 8
      );
    }
  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setGameStarted(true);
    onScoreUpdate(0);
  };

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="glitch-border max-w-full aspect-square"
      />
      
      {!gameStarted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-void/80 backdrop-blur-sm">
          <h2 className="text-4xl font-pixel glitch-text mb-8">SNAKE.EXE</h2>
          <button 
            onClick={resetGame}
            className="px-8 py-4 bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan font-pixel hover:bg-neon-cyan hover:text-void transition-all active:scale-95"
          >
            EXECUTE()
          </button>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-void/90 backdrop-blur-md">
          <h2 className="text-4xl font-pixel text-neon-magenta glitch-text mb-4">KERNEL_PANIC</h2>
          <p className="text-neon-cyan font-pixel text-xs mb-8">SCORE: {score}</p>
          <button 
            onClick={resetGame}
            className="px-8 py-4 bg-neon-magenta/20 border-2 border-neon-magenta text-neon-magenta font-pixel hover:bg-neon-magenta hover:text-void transition-all active:scale-95"
          >
            REBOOT_SYSTEM
          </button>
        </div>
      )}

      {/* Decorative corners */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-neon-yellow"></div>
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-neon-yellow"></div>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-neon-yellow"></div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-neon-yellow"></div>
    </div>
  );
};
