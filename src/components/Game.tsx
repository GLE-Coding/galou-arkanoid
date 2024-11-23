import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, ShoppingBag, Menu } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { useGameEntities } from '../hooks/useGameEntities';
import { useCollisionSystem } from '../hooks/useCollisionSystem';
import { useGameControls } from '../hooks/useGameControls';
import { useGameLoop } from '../hooks/useGameLoop';
import { Shop } from './Shop';
import { BallStats } from './BallStats';
import { ComboDisplay } from './ComboDisplay';
import { ConfirmDialog } from './ConfirmDialog';
import { TouchControls } from './TouchControls';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';

export const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [richMode, setRichMode] = useState(false);
  const [scale, setScale] = useState(1);

  const {
    gameState,
    score,
    lives,
    money,
    combo,
    startGame,
    resetGame,
    togglePause,
    openShop,
    closeShop,
    addScore,
    addMoney,
    spendMoney,
    incrementCombo,
    resetCombo,
    loseLife,
    addLife
  } = useGameState(richMode);

  const {
    paddleRef,
    ballRef,
    brickManagerRef,
    rendererRef,
    soundManagerRef,
    resetEntities,
    initializeRenderer
  } = useGameEntities();

  const { handleCollisions } = useCollisionSystem(
    addScore,
    addMoney,
    loseLife,
    openShop,
    incrementCombo,
    resetCombo,
    combo.count
  );

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const isLandscape = window.innerWidth > window.innerHeight;
        const maxHeight = window.innerHeight - (isLandscape ? 64 : 160);
        const maxWidth = Math.min(window.innerWidth - 32, isLandscape ? 1200 : 800);
        
        const scaleX = maxWidth / CANVAS_WIDTH;
        const scaleY = maxHeight / CANVAS_HEIGHT;
        
        let newScale = Math.min(scaleX, scaleY);
        newScale = Math.max(newScale, 0.3);
        newScale = Math.min(newScale, isLandscape ? 1 : 0.8);
        
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    initializeRenderer(ctx);
  }, [initializeRenderer]);

  const handleStartGame = () => {
    resetEntities();
    startGame();
  };

  const handleResetGame = () => {
    resetEntities();
    resetGame();
  };

  const handleEscapePress = () => {
    if (gameState === 'playing') {
      setShowConfirmDialog(true);
      togglePause();
    }
  };

  const handleConfirmExit = () => {
    setShowConfirmDialog(false);
    handleResetGame();
  };

  const handleCancelExit = () => {
    setShowConfirmDialog(false);
    togglePause();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    soundManagerRef.current.setMuted(!isMuted);
  };

  const handleUpgradePurchase = (upgrade: any) => {
    if (money >= upgrade.cost) {
      spendMoney(upgrade.cost);
      soundManagerRef.current.play('purchase');
      
      if (upgrade.id === 'extra-life') {
        addLife();
      } else if (upgrade.effect) {
        upgrade.effect(ballRef.current, paddleRef.current);
      }
    }
  };

  useGameControls(
    canvasRef,
    gameState,
    paddleRef.current,
    ballRef.current,
    soundManagerRef.current,
    togglePause,
    handleEscapePress,
    openShop
  );

  useGameLoop(
    gameState,
    ballRef.current,
    paddleRef.current,
    brickManagerRef.current,
    rendererRef.current,
    handleCollisions,
    soundManagerRef.current
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-4 touch-none select-none">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-4" ref={containerRef}>
        {/* Game Stats Bar */}
        <div className="w-full max-w-2xl px-4">
          <div className="bg-gray-800 rounded-lg p-3 flex justify-between items-center flex-wrap gap-2">
            <div className="text-purple-400 text-lg md:text-xl font-bold">Score: {score}</div>
            <div className="text-purple-400 text-lg md:text-xl font-bold">Lives: {lives}</div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-green-400 text-lg md:text-xl font-bold">${money}</div>
              <button
                onClick={openShop}
                className="text-purple-400 hover:text-purple-300 transition-colors p-3 touch-manipulation"
              >
                <ShoppingBag size={20} />
              </button>
              <button
                onClick={handleEscapePress}
                className="text-purple-400 hover:text-purple-300 transition-colors p-3 touch-manipulation"
              >
                <Menu size={20} />
              </button>
              <button
                onClick={handleMuteToggle}
                className="text-purple-400 hover:text-purple-300 transition-colors p-3 touch-manipulation"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
          {/* Game Canvas and Stats */}
          <div className="flex-1 flex flex-col items-center w-full">
            {/* Game Canvas */}
            <div className="relative w-full flex justify-center mb-4">
              <div 
                style={{ 
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  width: CANVAS_WIDTH,
                  height: CANVAS_HEIGHT
                }}
                className="relative mx-auto"
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="bg-gray-800 rounded-lg shadow-lg border-2 border-purple-500"
                />

                {gameState === 'playing' && (
                  <TouchControls
                    onMove={(position) => paddleRef.current.setPosition(position * CANVAS_WIDTH)}
                    onTap={() => {
                      if (ballRef.current.launch()) {
                        soundManagerRef.current.play('hit');
                      }
                    }}
                  />
                )}

                {gameState === 'menu' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 rounded-lg">
                    <h1 className="text-2xl md:text-4xl font-bold text-purple-400 mb-6 md:mb-8">ARKANOID</h1>
                    <div className="space-y-4">
                      <button
                        onClick={handleStartGame}
                        className="w-40 md:w-64 px-4 md:px-6 py-2 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-base md:text-xl font-bold touch-manipulation"
                      >
                        Start Game
                      </button>
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="checkbox"
                          id="richMode"
                          checked={richMode}
                          onChange={(e) => setRichMode(e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="richMode" className="text-purple-300 text-sm md:text-base">
                          Rich Mode
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {gameState === 'gameover' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 rounded-lg">
                    <div className="bg-gray-800 p-4 md:p-8 rounded-lg border-2 border-purple-500 text-center w-11/12 max-w-md mx-auto">
                      <h2 className="text-xl md:text-3xl font-bold text-purple-400 mb-4">Game Over!</h2>
                      <div className="space-y-2 mb-6">
                        <p className="text-lg md:text-2xl text-purple-300">Final Score: {score}</p>
                        <p className="text-base md:text-xl text-green-400">Money Earned: ${money}</p>
                      </div>
                      <div className="space-y-3">
                        <button
                          onClick={handleStartGame}
                          className="w-full px-4 md:px-6 py-2 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-base md:text-xl font-bold touch-manipulation"
                        >
                          Play Again
                        </button>
                        <button
                          onClick={handleResetGame}
                          className="w-full px-4 md:px-6 py-2 md:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-base md:text-xl font-bold touch-manipulation"
                        >
                          Back to Menu
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Info */}
            <div className="text-gray-400 text-center text-xs md:text-sm mb-4">
              <p className="mb-1 md:mb-2">Controls:</p>
              <p>Move paddle with mouse, touch, or arrow keys</p>
              <p>Tap screen, press SPACE, or click to launch ball</p>
              <p>Press E to fire missile (if equipped)</p>
              <p>Press B to open shop</p>
              <p>Press P to pause</p>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="flex flex-row lg:flex-col gap-4 justify-center w-full lg:w-64">
            <BallStats
              effects={ballRef.current.effects}
              damage={ballRef.current.getDamage()}
              paddleStats={paddleRef.current.stats}
            />
            <ComboDisplay combo={combo} />
          </div>
        </div>
      </div>

      <Shop
        isOpen={gameState === 'shop'}
        money={money}
        onClose={closeShop}
        onPurchase={handleUpgradePurchase}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        message="Are you sure you want to exit the game?"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </div>
  );
};