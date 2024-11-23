import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, ShoppingBag, Home, Info } from 'lucide-react';
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
import { CANVAS_WIDTH, CANVAS_HEIGHT, UPGRADES } from '../game/constants';

export const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [godMode, setGodMode] = useState(false);
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
  } = useGameState(godMode);

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
    const cost = godMode ? 0 : upgrade.cost;
    if (money >= cost) {
      spendMoney(cost);
      soundManagerRef.current.play('purchase');
      
      if (upgrade.id === 'extra-life') {
        addLife();
      } else if (upgrade.effect) {
        upgrade.effect(ballRef.current, paddleRef.current);
      }
    }
  };

  const handleInfoToggle = () => {
    if (showInfoDialog) {
      if (gameState === 'paused') {
        togglePause();
      }
    } else if (gameState === 'playing') {
      togglePause();
    }
    setShowInfoDialog(!showInfoDialog);
  };

  const handleInfoClose = () => {
    if (gameState === 'paused') {
      togglePause();
    }
    setShowInfoDialog(false);
  };

  useGameControls(
    canvasRef,
    gameState,
    paddleRef.current,
    ballRef.current,
    soundManagerRef.current,
    togglePause,
    handleEscapePress,
    openShop,
    handleInfoToggle,
    closeShop
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-4" ref={containerRef}>
        {/* Game state and buttons container */}
        <div className="w-full flex flex-row justify-between items-start">
          {/* Game info (score, life, money) - Left aligned */}
          <div className="flex flex-col items-start gap-1 pl-2">
            <p className="text-sm md:text-base text-gray-200">
              Score: <span className="text-purple-400">{score}</span>
            </p>
            <p className="text-sm md:text-base text-gray-200">
              Life: <span className="text-purple-400">{lives}</span>
            </p>
            <p className="text-sm md:text-base text-gray-200">
              Money: <span className="text-green-400">${money}</span>
            </p>
          </div>

          {/* Game buttons - Right aligned */}
          <div className="flex flex-row gap-2 pr-2">
            <button
              onClick={openShop}
              onTouchStart={openShop}
              className="bg-gray-700 hover:bg-gray-600 text-purple-400 hover:text-purple-300 transition-colors p-2 md:p-3 rounded-lg border border-gray-600 hover:border-purple-500 z-50"
              style={{ 
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'auto'
              }}
            >
              <ShoppingBag size={20} />
            </button>
            <button
              onClick={handleEscapePress}
              onTouchStart={handleEscapePress}
              className="bg-gray-700 hover:bg-gray-600 text-purple-400 hover:text-purple-300 transition-colors p-2 md:p-3 rounded-lg border border-gray-600 hover:border-purple-500 z-50"
              style={{ 
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'auto'
              }}
            >
              <Home size={20} />
            </button>
            <button
              onClick={handleInfoToggle}
              onTouchStart={(e) => { e.preventDefault(); handleInfoToggle(); }}
              className="bg-gray-700 hover:bg-gray-600 text-purple-400 hover:text-purple-300 transition-colors p-2 md:p-3 rounded-lg border border-gray-600 hover:border-purple-500 z-50"
              style={{ 
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'auto'
              }}
            >
              <Info size={20} />
            </button>
            <button
              onClick={handleMuteToggle}
              onTouchStart={handleMuteToggle}
              className="bg-gray-700 hover:bg-gray-600 text-purple-400 hover:text-purple-300 transition-colors p-2 md:p-3 rounded-lg border border-gray-600 hover:border-purple-500 z-50"
              style={{ 
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'auto'
              }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
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
                  height: CANVAS_HEIGHT,
                  touchAction: 'none'
                }}
                className="relative mx-auto"
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="bg-gray-800 rounded-lg shadow-lg border-2 border-purple-500"
                  style={{ touchAction: 'none' }}
                />

                {gameState === 'playing' && (
                  <>
                    <TouchControls
                      onMove={(position) => paddleRef.current.setPosition(position * CANVAS_WIDTH)}
                      onTap={() => {
                        if (ballRef.current.launch()) {
                          soundManagerRef.current.play('hit');
                        }
                      }}
                    />
                    <div className="absolute -bottom-16 left-4">
                      <button
                        onClick={() => {
                          if (paddleRef.current.fireMissile(ballRef.current.getDamage())) {
                            soundManagerRef.current.play('missile');
                          }
                        }}
                        onTouchStart={() => {
                          if (paddleRef.current.fireMissile(ballRef.current.getDamage())) {
                            soundManagerRef.current.play('missile');
                          }
                        }}
                        disabled={!paddleRef.current.stats.hasMissileLauncher || paddleRef.current.stats.missileAmmo <= 0}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors z-50 ${
                          paddleRef.current.stats.hasMissileLauncher && paddleRef.current.stats.missileAmmo > 0
                            ? 'bg-gray-700 hover:bg-gray-600 text-purple-400 hover:text-purple-300 border border-gray-600 hover:border-purple-500'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                        }`}
                        style={{ 
                          touchAction: 'none',
                          WebkitTapHighlightColor: 'transparent',
                          WebkitTouchCallout: 'none',
                          WebkitUserSelect: 'none',
                          pointerEvents: 'auto'
                        }}
                      >
                        Fire ({paddleRef.current.stats.missileAmmo})
                      </button>
                    </div>
                  </>
                )}

                {gameState === 'menu' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 rounded-lg">
                    <h1 className="text-2xl md:text-4xl font-bold text-purple-400 mb-6 md:mb-8">GALOU ARKANOID</h1>
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
                          id="godMode"
                          checked={godMode}
                          onChange={(e) => setGodMode(e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="godMode" className="text-purple-300 text-sm md:text-base">
                          God Mode
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
        onClose={closeShop}
        money={money}
        onPurchase={handleUpgradePurchase}
        upgrades={UPGRADES.map(upgrade => ({
          ...upgrade,
          cost: godMode ? 0 : upgrade.cost
        }))}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        message="Are you sure you want to exit to menu?"
      />
      
      {/* Info Dialog */}
      {showInfoDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 max-w-md w-full">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Game Controls</h2>
            <div className="space-y-2 text-gray-300">
              <p>🖱️ Move paddle with mouse</p>
              <p>👆 Use touch controls on mobile</p>
              <p>⌨️ Use arrow keys on keyboard</p>
              <p>⚡ Press SPACE or tap to launch ball</p>
              <p>🚀 Press E to fire missile (if equipped)</p>
              <p>🛍️ Press B to open shop</p>
              <p>⏸️ Press P to pause</p>
              <p>ℹ️ Press I to show/hide controls</p>
            </div>
            <button
              onClick={handleInfoClose}
              className="mt-6 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};