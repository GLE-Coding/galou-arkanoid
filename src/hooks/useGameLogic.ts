// Update the return object in useGameLogic.ts to include paddleStats
return {
  score,
  lives,
  money,
  combo,
  gameState,
  ballEffects: ballRef.current.effects,
  ballDamage: ballRef.current.getDamage(),
  paddleStats: paddleRef.current.stats, // Add this line
  startGame: handleStartGame,
  resetGame: handleResetGame,
  togglePause: handleTogglePause,
  openShop,
  closeShop,
  handlePurchase,
  addLife
};