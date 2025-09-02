'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MatrixRain from '../components/MatrixRain';

export default function Register() {
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [loading, setLoading] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'active' | 'stopped'>('waiting');
  const router = useRouter();

  // Set mounted state for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check game status
  useEffect(() => {
    if (!mounted) return;

    const checkGameStatus = async () => {
      try {
        const response = await fetch('/api/game-status');
        const data = await response.json();
        
        if (response.ok) {
          setGameStatus(data.status);
        }
      } catch (error) {
        console.error('Error checking game status:', error);
      }
    };

    checkGameStatus();
    const interval = setInterval(checkGameStatus, 3000);
    
    return () => clearInterval(interval);
  }, [mounted]);

  // Matrix-style terminal boot sequence
  useEffect(() => {
    if (!mounted) return;

    const bootSequence = [
      'INITIALIZING SYSTEM...',
      'LOADING SECURITY PROTOCOLS...',
      'ESTABLISHING CONNECTION...',
      'ACCESSING MAINFRAME...',
      'AUTHENTICATION TERMINAL READY',
      'ENTER CREDENTIALS TO PROCEED'
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < bootSequence.length) {
        setTerminalText(bootSequence[currentIndex]);
        currentIndex++;
      } else {
        setShowForm(true);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roll.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), roll: roll.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        // Always redirect to game page, even if game is not active
        router.push(`/game/${data.user.id}`);
      } else {
        alert(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono">
      {/* Matrix Rain Effect */}
      <MatrixRain />

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/3 to-transparent animate-pulse"></div>

      {/* CRT Monitor Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>

      {/* Main Container */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-4/5">
          {/* Terminal Header */}
          <div className="bg-gray-800 border-2 border-green-400 rounded-t-lg p-4 mb-2 z-30 relative" style={{backgroundColor: '#1f2937'}}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-green-300 text-sm ml-4 font-semibold">
                HACK_THE_FIREWALL.exe - Terminal Access
              </div>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="bg-black border-2 border-green-400 rounded-b-lg px-8 py-6 min-h-[600px] relative z-30" style={{backgroundColor: '#000000'}}>
            {/* Terminal Cursor Blink */}
            <div className="absolute top-6 right-6 w-2 h-4 bg-green-400 animate-pulse"></div>

            {/* Boot Sequence */}
            {!showForm && (
              <div className="space-y-2 text-green-300">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2 font-bold">$</span>
                  <span className="animate-pulse font-medium">{terminalText}</span>
                  <span className="ml-1 animate-pulse text-green-400">_</span>
                </div>
              </div>
            )}

            {/* Registration Form */}
            {showForm && (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mb-4">
                    <h1 className="text-4xl font-bold text-green-300 mb-2 tracking-wider glitch-text">
                      HACK THE FIREWALL
                    </h1>
                    <div className="w-48 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto"></div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-200 text-sm font-medium">
                      <span className="text-green-300">[</span> SECURE ACCESS TERMINAL <span className="text-green-300">]</span>
                    </p>
                    <p className="text-gray-300 text-xs">
                      ENTER CREDENTIALS TO INITIALIZE HACKING SEQUENCE
                    </p>
                  </div>
                </div>

                {/* Game Status Check */}
                {gameStatus !== 'active' && (
                  <div className="bg-yellow-900 border-2 border-yellow-500 rounded-lg p-6 text-center mb-6">
                    <div className="text-4xl mb-4">⏳</div>
                    <h2 className="text-2xl text-yellow-300 font-bold mb-2">
                      {gameStatus === 'waiting' ? 'GAME NOT STARTED YET' : 'GAME IS STOPPED'}
                    </h2>
                    <p className="text-yellow-200 text-lg">
                      {gameStatus === 'waiting' 
                        ? 'You can register now, but the game will start when admin activates it.' 
                        : 'The game has been stopped by the admin.'
                      }
                    </p>
                    <div className="mt-4 text-yellow-400 text-sm">
                      Register below to join the waiting list.
                    </div>
                  </div>
                )}

                {/* Form - Show always, but with different button text */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2 font-bold">root@firewall:~$</span>
                      <span className="text-green-300 font-medium">./register.sh</span>
                    </div>

                    <div className="ml-8 space-y-8">
                      <div className="flex items-center space-x-4">
                        <label className="text-green-300 text-sm font-semibold whitespace-nowrap">
                          ENTER USERNAME:
                        </label>
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black border-2 border-green-600 text-white font-mono px-4 py-3 text-base focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all duration-300 rounded-none"
                            placeholder="username"
                            required
                            disabled={loading}
                          />
                          <div className="absolute inset-0 border-2 border-green-400/30 pointer-events-none"></div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="text-green-300 text-sm font-semibold whitespace-nowrap">
                          ENTER APPLICATION NO.:
                        </label>
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={roll}
                            onChange={(e) => setRoll(e.target.value)}
                            className="w-full bg-black border-2 border-green-600 text-white font-mono px-4 py-3 text-base focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all duration-300 rounded-none"
                            placeholder="application_no"
                            required
                            disabled={loading}
                          />
                          <div className="absolute inset-0 border-2 border-green-400/30 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={loading || !name.trim() || !roll.trim()}
                      className="w-full relative group"
                    >
                      {/* Background with animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 disabled:opacity-40 disabled:from-gray-500 disabled:via-gray-400 disabled:to-gray-500"></div>
                      
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-lg blur-md opacity-60 group-hover:opacity-80 transition-all duration-300 disabled:opacity-20"></div>
                      
                      {/* Border */}
                      <div className="absolute inset-0 rounded-lg border-2 border-green-300 group-hover:border-green-200 transition-colors duration-300 disabled:border-gray-400"></div>
                      
                      {/* Content */}
                      <div className="relative z-10 py-4 px-6 text-white font-mono font-bold text-base tracking-wide flex items-center justify-center disabled:cursor-not-allowed disabled:text-red-500">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                            <span className="animate-pulse">EXECUTING HACK...</span>
                          </>
                        ) : (
                          <>
                            <span className="mr-2">⚡</span>
                            {gameStatus === 'active' ? 'INITIALIZE HACKING SEQUENCE' : 'JOIN WAITING LIST'}
                            <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300">&gt;&gt;</span>
                          </>
                        )}
                      </div>
                      
                      {/* Scan line effect */}
                      <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-40 animate-pulse group-hover:opacity-60 disabled:opacity-0"></div>
                        <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-40 animate-pulse group-hover:opacity-60 disabled:opacity-0" style={{animationDelay: '0.5s'}}></div>
                      </div>
                    </button>
                  </div>
                </form>

                {/* Status Bar */}
                <div className="mt-8 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600">SYSTEM: {gameStatus.toUpperCase()}</span>
                    </div>
                    <div className="text-gray-500">
                      <span className="text-green-400">[</span> SECURE CONNECTION <span className="text-green-400">]</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Footer */}
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-4 mt-2 z-30 relative" style={{backgroundColor: '#111827'}}>
            <div className="flex items-center justify-between text-green-400 text-sm">
              <div>STATUS: {showForm ? 'AWAITING INPUT' : 'BOOTING...'}</div>
              <div>PROTOCOL: SSH-2.0</div>
              <div>ENCRYPTION: AES-256</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .glitch-text {
          animation: glitch 0.3s infinite;
        }
      `}</style>
    </div>
  );
}