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

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (response.ok) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetLeaderboard = async () => {
    if (!confirm('Are you sure you want to reset the entire leaderboard? This action cannot be undone.')) {
      return;
    }

    setResetting(true);
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setLeaderboard([]);
        alert('Leaderboard has been reset successfully!');
      } else {
        alert('Failed to reset leaderboard. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting leaderboard:', error);
      alert('Failed to reset leaderboard. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-green-400 font-mono text-2xl animate-pulse text-center">
          LOADING LEADERBOARD...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono">
      <MatrixRain />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/3 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-4/5">
          {/* Terminal Header */}
          <div className="bg-gray-800 border-2 border-green-400 rounded-t-lg p-4 mb-2 text-center z-30 relative" style={{backgroundColor: '#1f2937'}}>
            <div className="flex items-center justify-between">
              <div></div>
              <h1 className="text-3xl font-bold text-green-300 tracking-wider">LEADERBOARD</h1>
              <button
                onClick={resetLeaderboard}
                disabled={resetting}
                className="bg-red-800 hover:bg-red-700 text-white font-mono py-2 px-4 text-sm border border-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/30"
              >
                {resetting ? 'RESETTING...' : 'RESET'}
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="bg-black border-2 border-green-400 rounded-b-lg px-8 py-8 z-30" style={{backgroundColor: '#000000'}}>
            <div className="text-lg text-gray-200 mb-6 text-center">
              HACK THE FIREWALL - LIVE RANKINGS <span className="text-sm text-gray-400 block mt-1">🔄 Auto-refreshing every 5 seconds</span>
            </div>

            <div className="bg-gray-900 border border-green-500 rounded-lg overflow-hidden shadow-lg shadow-green-500/20 mb-8">
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
                            <div className="text-sm text-gray-300 font-mono">{formatTime(entry.timeElapsed)}</div>
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
                <p className="text-lg leading-relaxed">Waiting for brave hackers to join the challenge!</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-12 pt-8 border-t border-green-900">
              <div className="space-y-4">
                <p className="text-gray-400 text-base">Coding Club Ice Breaker Game | Real-time Updates Active</p>
                <div>
                  <a href="/register" className="inline-block bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600 text-black font-mono py-3 px-6 text-base font-medium border-2 border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30">
                    JOIN GAME {'>>'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}