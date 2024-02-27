import React, { useState, useEffect, useRef } from 'react';

const CANVAS_SIZE = 500;
const SNAKE_START = [[8, 8], [8, 9]];
const APPLE_START = [8, 3];
const SCALE = 20;
const SPEED = {
  beginner: 150,
  intermediate: 100,
  advanced: 50
};

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState<[number, number]>([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      context.fillStyle = 'black';
      snake.forEach(([x, y], index) => {
        if (index === 0) {
          context.fillStyle = 'green'; // Color de la cabeza
        } else {
          context.fillStyle = 'black'; // Color del cuerpo
        }
        context.fillRect(x, y, 1, 1);
      });
      context.fillStyle = 'red';
      context.fillRect(apple[0], apple[1], 1, 1);
    }
  }, [snake, apple, gameOver]);

  useEffect(() => {
    const checkCollisionWithBorder = (head: [number, number]) => {
      if (
        head[0] < 0 ||
        head[0] >= CANVAS_SIZE / SCALE ||
        head[1] < 0 ||
        head[1] >= CANVAS_SIZE / SCALE
      ) {
        setGameOver(true);
      }
    };

    const checkCollisionWithSelf = (head: [number, number]) => {
      for (let i = 1; i < snake.length; i++) {
        if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
          setGameOver(true);
          break;
        }
      }
    };

    if (gameStarted && speed) {
      const interval = setInterval(() => {
        const snakeCopy = [...snake];
        const newHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
        checkCollisionWithBorder(newHead);
        checkCollisionWithSelf(newHead);

        if (!gameOver) {
          snakeCopy.unshift(newHead);
          if (newHead[0] === apple[0] && newHead[1] === apple[1]) {
            setApple([
              Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
              Math.floor(Math.random() * (CANVAS_SIZE / SCALE))
            ]);
            setScore(score + 1);
          } else {
            snakeCopy.pop();
          }
          setSnake(snakeCopy);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [snake, dir, gameOver, gameStarted, apple, score, speed]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        setGameStarted(true);
      }
      switch (e.key) {
        case 'ArrowUp':
          if (dir[1] !== 1) setDir([0, -1]);
          break;
        case 'ArrowDown':
          if (dir[1] !== -1) setDir([0, 1]);
          break;
        case 'ArrowLeft':
          if (dir[0] !== 1) setDir([-1, 0]);
          break;
        case 'ArrowRight':
          if (dir[0] !== -1) setDir([1, 0]);
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dir, gameStarted]);

  useEffect(() => {
    const detectMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobile(detectMobile());
  }, []);

  const restartGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  const handleSpeedChange = (speedValue: number) => {
    setSpeed(speedValue);
    restartGame();
  };

  const handleMobileDirection = (direction: [number, number]) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    setDir(direction);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width={`${CANVAS_SIZE}px`}
        height={`${CANVAS_SIZE}px`}
        style={{ border: '3px solid black', backgroundColor: 'lightgrey' }}
      />
      {isMobile && (
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <button onClick={() => handleMobileDirection([0, -1])}>{'\u2B06'}</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
            <button onClick={() => handleMobileDirection([-1, 0])}>{'\u2B05'}</button>
            <button onClick={() => handleMobileDirection([1, 0])}>{'\u2B07'}</button>
          </div>
          <button onClick={() => handleMobileDirection([0, 1])}>{'\u2B07'}</button>
        </div>
      )}
      <div style={{ marginTop: '10px' }}>
        <h4 style={scoreStyle}>Score: <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{score}</span></h4>
        {gameOver && <h3 style={gameOverStyle}>Game Over!</h3>}
        <div>
          <button onClick={() => handleSpeedChange(SPEED.beginner)}>Beginner</button>
          <button onClick={() => handleSpeedChange(SPEED.intermediate)}>Intermediate</button>
          <button onClick={() => handleSpeedChange(SPEED.advanced)}>Advanced</button>
        </div>
        <button onClick={restartGame} style={{ marginTop: '10px' }}>Restart</button>
      </div>
    </div>
  );
};

const scoreStyle: React.CSSProperties = {
  color: 'green'
};

const gameOverStyle: React.CSSProperties = {
  color: 'red',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  animation: 'fadeInOut 2s linear'
};

export default App;
