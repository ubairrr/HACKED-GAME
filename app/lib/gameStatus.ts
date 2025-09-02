// Shared game status for all API endpoints
let gameStatus: 'waiting' | 'active' | 'stopped' = 'waiting';

export const getGameStatus = () => gameStatus;

export const setGameStatus = (status: 'waiting' | 'active' | 'stopped') => {
  gameStatus = status;
};

export const isGameActive = () => gameStatus === 'active';
export const isGameWaiting = () => gameStatus === 'waiting';
export const isGameStopped = () => gameStatus === 'stopped';
