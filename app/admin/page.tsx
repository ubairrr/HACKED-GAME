'use client';

import { useState, useEffect } from 'react';
import MatrixRain from '../components/MatrixRain';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  roll: string;
  points: number;
  status: string;
  timeElapsed: number | null;
}

export default function Admin() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'active' | 'stopped'>('waiting');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (response.ok) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchGameStatus = async () => {
    try {
      const response = await fetch('/api/game-status');
      const data = await response.json();
      
      if (response.ok) {
        setGameStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching game status:', error);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    fetchLeaderboard();
    fetchGameStatus();
    
    const interval = setInterval(() => {
      fetchLeaderboard();
      fetchGameStatus();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [mounted]);

  const startGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/game-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });
      
      if (response.ok) {
        setGameStatus('active');
        alert('Game started successfully!');
      } else {
        alert('Failed to start game. Please try again.');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stopGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/game-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stop' }),
      });
      
      if (response.ok) {
        setGameStatus('stopped');
        alert('Game stopped successfully!');
      } else {
        alert('Failed to stop game. Please try again.');
      }
    } catch (error) {
      console.error('Error stopping game:', error);
      alert('Failed to stop game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetGame = async () => {
    if (!confirm('Are you sure you want to reset the entire game? This will clear all data and cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/game-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset' }),
      });
      
      if (response.ok) {
        setGameStatus('waiting');
        setLeaderboard([]);
        alert('Game reset successfully!');
      } else {
        alert('Failed to reset game. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting game:', error);
      alert('Failed to reset game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono">
      <MatrixRain />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/3 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-4/5">
          {/* Terminal Header */}
          <div className="bg-gray-800 border-2 border-green-400 rounded-t-lg p-4 mb-2 z-30 relative" style={{backgroundColor: '#1f2937'}}>
            <div className="flex items-center justify-between">
              <div className="text-green-300 text-sm font-semibold">ADMIN CONTROL PANEL</div>
              <div className="text-green-300 text-sm font-semibold">
                STATUS: {gameStatus.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="bg-black border-2 border-green-400 rounded-b-lg px-8 py-6 z-30" style={{backgroundColor: '#000000'}}>
            {/* Game Control Section */}
            <div className="mb-8">
              <h2 className="text-2xl text-green-300 font-bold mb-4">GAME CONTROLS</h2>
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={startGame}
                  disabled={loading || gameStatus === 'active'}
                  className="bg-green-800 hover:bg-green-700 disabled:bg-gray-700 text-white font-mono py-3 px-6 text-base font-medium border-2 border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/30"
                >
                  {loading ? 'PROCESSING...' : 'START GAME'}
                </button>
                <button
                  onClick={stopGame}
                  disabled={loading || gameStatus !== 'active'}
                  className="bg-yellow-800 hover:bg-yellow-700 disabled:bg-gray-700 text-white font-mono py-3 px-6 text-base font-medium border-2 border-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-yellow-500/30"
                >
                  {loading ? 'PROCESSING...' : 'STOP GAME'}
                </button>
                <button
                  onClick={resetGame}
                  disabled={loading}
                  className="bg-red-800 hover:bg-red-700 text-white font-mono py-3 px-6 text-base font-medium border-2 border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/30"
                >
                  {loading ? 'PROCESSING...' : 'RESET GAME'}
                </button>
              </div>
              
              <div className="bg-gray-900 border border-green-700 rounded-lg p-4">
                <div className="text-green-300 font-semibold mb-2">CURRENT STATUS:</div>
                <div className="text-gray-200">
                  {gameStatus === 'waiting' && '⏳ Waiting for players to register...'}
                  {gameStatus === 'active' && '🎮 Game is currently running! Players can play now.'}
                  {gameStatus === 'stopped' && '⏹️ Game has been stopped. No new games allowed.'}
                </div>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div>
              <h2 className="text-2xl text-green-300 font-bold mb-4">LIVE LEADERBOARD</h2>
              <div className="bg-gray-900 border border-green-500 rounded-lg overflow-hidden shadow-lg shadow-green-500/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-green-900 text-green-100">
                        <th className="px-4 py-3 text-left text-sm font-bold tracking-wider">RANK</th>
                        <th className="px-4 py-3 text-left text-sm font-bold tracking-wider">PLAYER</th>
                        <th className="px-4 py-3 text-left text-sm font-bold tracking-wider hidden sm:table-cell">ROLL</th>
                        <th className="px-4 py-3 text-center text-sm font-bold tracking-wider">POINTS</th>
                        <th className="px-4 py-3 text-center text-sm font-bold tracking-wider hidden md:table-cell">TIME</th>
                        <th className="px-4 py-3 text-center text-sm font-bold tracking-wider">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry) => {
                        const isTopThree = entry.rank <= 3;
                        const isWinner = entry.rank === 1 && entry.status === 'Completed';
                        
                        return (
                          <tr
                            key={entry.id}
                            className={`border-b border-gray-700 transition-all duration-200 hover:bg-gray-800/70 ${
                              isTopThree 
                                ? 'bg-green-900/20 shadow-md shadow-green-500/10' 
                                : 'bg-gray-800/50'
                            } ${
                              isWinner ? 'animate-pulse' : ''
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className={`text-xl font-bold ${
                                entry.rank === 1 ? 'text-yellow-400' :
                                entry.rank === 2 ? 'text-gray-300' :
                                entry.rank === 3 ? 'text-orange-400' :
                                'text-green-400'
                              }`}>
                                {entry.rank === 1 && '🥇'}
                                {entry.rank === 2 && '🥈'}
                                {entry.rank === 3 && '🥉'}
                                {entry.rank > 3 && entry.rank}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className={`text-base font-semibold ${
                                isTopThree ? 'text-green-300' : 'text-gray-300'
                              }`}>
                                {entry.name}
                              </div>
                              <div className="text-xs text-gray-500 sm:hidden">{entry.roll}</div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <div className="text-sm text-gray-400">{entry.roll}</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className={`text-xl font-bold ${entry.points === 50 ? 'text-green-300' : 'text-green-400'}`}>{entry.points}</div>
                            </td>
                            <td className="px-4 py-3 text-center hidden md:table-cell">
                              <div className="text-sm text-gray-300 font-mono">
                                {entry.timeElapsed ? `${Math.floor(entry.timeElapsed / 60)}:${(entry.timeElapsed % 60).toString().padStart(2, '0')}` : '--'}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                entry.status === 'Completed' 
                                  ? 'bg-green-800 text-green-100 border border-green-600' 
                                  : 'bg-yellow-800 text-yellow-100 border border-yellow-600'
                              }`}>
                                <span className="hidden sm:inline">{entry.status === 'Completed' ? '✓ HACKED' : '⚡ IN PROGRESS'}</span>
                                <span className="sm:hidden">{entry.status === 'Completed' ? '✓' : '⚡'}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {leaderboard.length === 0 && (
                <div className="text-center text-gray-400 py-16">
                  <div className="text-6xl mb-6">🔒</div>
                  <p className="text-2xl mb-4 font-semibold">No players yet...</p>
                  <p className="text-lg leading-relaxed">Waiting for players to register and join the challenge!</p>
                </div>
              )}
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-4 mt-2 z-30 relative" style={{backgroundColor: '#111827'}}>
            <div className="flex items-center justify-between text-green-400 text-sm">
              <div>ADMIN PANEL: ACTIVE</div>
              <div>PROTOCOL: SSH-2.0</div>
              <div>ENCRYPTION: AES-256</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
