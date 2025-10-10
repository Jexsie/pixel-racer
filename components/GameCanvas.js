"use client";

import { useEffect, useRef, useState } from "react";
import soundManager from "@/lib/soundManager";
import { CONFIG } from "@/lib/gameConfig";
import { PlayerCar } from "@/lib/classes/PlayerCar";
import { Obstacle } from "@/lib/classes/Obstacle";
import { Particle } from "@/lib/classes/Particle";
import {
  checkCollision,
  drawRoad,
  drawSpeedIndicator,
  drawStartScreen,
} from "@/lib/gameUtils";
import ScoreDisplay from "./ScoreDisplay";
import GameOverScreen from "./GameOverScreen";
import MobileControls from "./MobileControls";
import CelebrationEffect from "./CelebrationEffect";

export default function GameCanvas({ carColor }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameStateRef = useRef(null);
  const playerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;

    // Initialize game state
    const gameState = {
      isPlaying: false,
      gameStarted: false,
      score: 0,
      highScore: 0,
      roadOffset: 0,
      obstacles: [],
      particles: [],
      speedMultiplier: 1.0,
      currentSpawnRate: CONFIG.obstacleSpawnRate,
    };

    const player = new PlayerCar(canvas);
    playerRef.current = player;
    gameStateRef.current = gameState;

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("pixelRacerHighScore");
    if (savedHighScore) {
      gameState.highScore = parseInt(savedHighScore);
      setHighScore(parseInt(savedHighScore));
    }

    // Collision detection
    const checkCollisions = () => {
      const playerBounds = player.getBounds();

      for (let obstacle of gameState.obstacles) {
        const obstacleBounds = obstacle.getBounds();
        const jumpClearance = 50;
        const isJumpingOverObstacle =
          player.isJumping && player.baseY - player.y > jumpClearance;

        if (
          checkCollision(playerBounds, obstacleBounds) &&
          !isJumpingOverObstacle
        ) {
          // Play crash sound
          soundManager.playCrashSound();

          // Create explosion particles
          for (let i = 0; i < 20; i++) {
            gameState.particles.push(
              new Particle(
                playerBounds.x + playerBounds.width / 2,
                playerBounds.y + playerBounds.height / 2
              )
            );
          }
          handleGameOver();
          return;
        }
      }
    };

    // Spawn obstacles
    const spawnObstacle = () => {
      if (Math.random() < gameState.currentSpawnRate) {
        const lane = Math.floor(Math.random() * CONFIG.roadLanes);
        const types = ["car", "car", "car", "barrier", "oil"];
        const type = types[Math.floor(Math.random() * types.length)];

        // Check if obstacle too close in this lane
        const tooClose = gameState.obstacles.some(
          (obs) => obs.lane === lane && obs.y < 100
        );

        if (!tooClose) {
          gameState.obstacles.push(
            new Obstacle(canvas, lane, type, gameState.speedMultiplier)
          );
        }
      }
    };

    // Render function
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawRoad(ctx, canvas, gameState.roadOffset);

      gameState.obstacles.forEach((obstacle) => obstacle.draw(ctx));

      player.draw(ctx, carColor);

      gameState.particles.forEach((particle) => particle.draw(ctx));

      if (gameState.isPlaying) {
        drawSpeedIndicator(ctx, gameState.speedMultiplier);
      }

      if (!gameState.gameStarted && !gameState.isPlaying) {
        drawStartScreen(ctx, canvas);
      }
    };

    // Update function
    const update = () => {
      if (!gameState.isPlaying) return;

      // Increase difficulty over time
      if (gameState.speedMultiplier < CONFIG.maxSpeedMultiplier) {
        gameState.speedMultiplier += CONFIG.difficultyIncrease;
      }

      if (gameState.currentSpawnRate < CONFIG.maxSpawnRate) {
        gameState.currentSpawnRate += CONFIG.spawnRateIncrease;
      }

      // Update road scroll
      gameState.roadOffset += CONFIG.obstacleSpeed * gameState.speedMultiplier;

      // Update player
      player.update();

      // Spawn obstacles
      spawnObstacle();

      // Update obstacles
      gameState.obstacles.forEach((obstacle) => {
        obstacle.update();

        // Award points for passing obstacles
        if (!obstacle.passed && obstacle.y > player.y) {
          obstacle.passed = true;
          gameState.score += CONFIG.scoreIncrement;
        }
      });

      // Remove off-screen obstacles
      gameState.obstacles = gameState.obstacles.filter(
        (obs) => !obs.isOffScreen()
      );

      // Update particles
      gameState.particles.forEach((particle) => particle.update());
      gameState.particles = gameState.particles.filter(
        (particle) => !particle.isDead()
      );

      // Check collisions
      checkCollisions();

      // Increase score over time (scales with difficulty)
      gameState.score += 0.1 * gameState.speedMultiplier;
      setScore(Math.floor(gameState.score));
    };

    // Game loop
    const gameLoop = () => {
      update();
      render();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Game over handler
    const handleGameOver = () => {
      gameState.isPlaying = false;

      // Stop background music
      soundManager.stopBackgroundMusic();

      const currentScore = Math.floor(gameState.score);
      const isNewHighScore = currentScore > gameState.highScore;

      if (isNewHighScore) {
        // New high score achieved!
        gameState.highScore = currentScore;
        localStorage.setItem("pixelRacerHighScore", currentScore);
        setHighScore(currentScore);

        // Show celebration effect
        setShowCelebration(true);

        // Play celebration sound
        soundManager.playCelebrationSound();

        console.log(`🎉 NEW HIGH SCORE: ${currentScore}!`);
      }

      setFinalScore(currentScore);
      setIsGameOver(true);
    };

    // Start game (first time)
    const startGame = () => {
      gameState.isPlaying = true;
      gameState.gameStarted = true;
      gameState.score = 0;
      gameState.speedMultiplier = 1.0;
      gameState.currentSpawnRate = CONFIG.obstacleSpawnRate;
      setScore(0);
      setIsGameOver(false);

      // Initialize and start background music
      if (!soundManager.isInitialized) {
        soundManager.init();
      }
      soundManager.startBackgroundMusic();
    };

    // Restart game
    const restartGame = () => {
      gameState.isPlaying = true;
      gameState.gameStarted = true;
      gameState.score = 0;
      gameState.roadOffset = 0;
      gameState.obstacles = [];
      gameState.particles = [];
      gameState.speedMultiplier = 1.0;
      gameState.currentSpawnRate = CONFIG.obstacleSpawnRate;

      // Reset player
      player.lane = 1;
      player.x = player.getLaneX(1);
      player.targetX = player.x;
      player.y = player.baseY;
      player.isJumping = false;
      player.jumpVelocity = 0;

      setScore(0);
      setIsGameOver(false);

      // Restart background music
      soundManager.startBackgroundMusic();
    };

    // Keyboard event handler
    const handleKeyDown = (e) => {
      if (gameState.isPlaying) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          player.moveLeft();
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          player.moveRight();
        } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
          player.jump();
        }
      }

      // Start or restart with spacebar
      if (e.key === " " && !gameState.isPlaying) {
        e.preventDefault();
        if (!gameState.gameStarted) {
          startGame();
        } else {
          restartGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clean up sound on unmount
      soundManager.stopBackgroundMusic();
    };
  }, [carColor]);

  const handleRestart = () => {
    const gameState = gameStateRef.current;
    const player = playerRef.current;

    if (gameState && player) {
      gameState.isPlaying = true;
      gameState.gameStarted = true;
      gameState.score = 0;
      gameState.roadOffset = 0;
      gameState.obstacles = [];
      gameState.particles = [];
      gameState.speedMultiplier = 1.0;
      gameState.currentSpawnRate = CONFIG.obstacleSpawnRate;

      // Reset player position
      player.lane = 1;
      player.x = player.getLaneX(1);
      player.targetX = player.x;
      player.y = player.baseY;
      player.isJumping = false;
      player.jumpVelocity = 0;

      setScore(0);
      setIsGameOver(false);

      // Restart music
      soundManager.startBackgroundMusic();
    }
  };

  const handleMoveLeft = () => {
    playerRef.current?.moveLeft();
  };

  const handleMoveRight = () => {
    playerRef.current?.moveRight();
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  return (
    <div className="game-container">
      <ScoreDisplay score={score} highScore={highScore} />

      <canvas ref={canvasRef} id="gameCanvas" />

      <GameOverScreen
        isVisible={isGameOver}
        finalScore={finalScore}
        onRestart={handleRestart}
      />

      <MobileControls
        onMoveLeft={handleMoveLeft}
        onMoveRight={handleMoveRight}
      />

      <CelebrationEffect
        isActive={showCelebration}
        onComplete={handleCelebrationComplete}
      />
    </div>
  );
}
