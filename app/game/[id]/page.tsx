'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MatrixRain from '../../components/MatrixRain';

const challenges = [
  {
    id: 1,
    title: "Caesar Cipher Breach",
    description: "The first firewall layer uses a simple Caesar cipher. Decode the intercepted message to proceed.",
    question: "Decrypt this Caesar cipher (shift of 3): Khoor",
    placeholder: "Enter decoded message"
  },
  {
    id: 2,
    title: "Binary Protocol Decode",
    description: "The system communicates in binary. Decode this intercepted transmission.",
    question: "Decode this binary: 01001000 01001001",
    placeholder: "Enter decoded text"
  },
  {
    id: 3,
    title: "Network Protocol Analysis",
    description: "The system uses a specific network protocol. Identify it.",
    question: "What does 'HTTP' stand for?",
    options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "Home Transfer Protocol", "Host Transfer Protocol"],
    type: "multiple-choice"
  },
  {
    id: 4,
    title: "Database Knowledge Test",
    description: "To access the database, you need to prove your SQL knowledge.",
    question: "What does 'SQL' stand for?",
    options: ["Standard Query Language", "Structured Query Language", "Simple Query Language", "System Query Language"],
    type: "multiple-choice"
  },
  {
    id: 5,
    title: "Final System Breach",
    description: "You have reached the core system. Answer the final question to complete the hack.",
    question: "What is the best coding community of Jamia Hamdard?",
    placeholder: "Enter community name"
  }
];

export default function Game() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [answer, setAnswer] = useState('');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [userName, setUserName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'active' | 'stopped'>('active');
  const [statusChecked, setStatusChecked] = useState(false);

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

  useEffect(() => {
    // In a real app, you might fetch user data here
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setFeedback('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          challengeId: currentChallenge,
          answer: answer.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.correct) {
          setPoints(data.user.points);
          setFeedback('ACCESS GRANTED! Moving to next challenge...');
          
          if (data.isComplete) {
            setIsComplete(true);
            setUserName(data.user.name);
          } else {
            setTimeout(() => {
              setCurrentChallenge(prev => prev + 1);
              setAnswer('');
              setFeedback('');
            }, 2000);
          }
        } else {
          setFeedback('ACCESS DENIED! Try again.');
        }
      } else {
        setFeedback(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFeedback('Connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isComplete) {
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
                <div className="text-green-300 text-sm font-semibold">SYSTEM BREACHED</div>
                <div className="text-green-300 text-sm font-semibold">POINTS: {points}</div>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="bg-black border-2 border-green-400 rounded-b-lg px-8 py-10 z-30" style={{backgroundColor: '#000000'}}>
              <div className="text-center max-w-2xl mx-auto">
                <div className="animate-pulse mb-8">
                  <h1 className="text-4xl sm:text-6xl text-green-300 mb-4 drop-shadow-lg leading-tight">ACCESS GRANTED</h1>
                  <h2 className="text-2xl sm:text-3xl text-green-200 mb-6 leading-relaxed">SYSTEM BREACHED BY {userName.toUpperCase()}</h2>
                </div>
                <div className="bg-gray-900 border border-green-500 rounded-lg shadow-lg shadow-green-500/20 max-w-lg mx-auto">
                  <div className="p-6 sm:p-8">
                    <p className="text-green-300 text-xl sm:text-2xl mb-4 font-bold">TOTAL POINTS: {points}</p>
                    <p className="text-gray-200 text-base sm:text-lg mb-6 leading-relaxed">Congratulations! You have successfully hacked the firewall.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-4 mt-2 z-30 relative" style={{backgroundColor: '#111827'}}>
              <div className="flex items-center justify-between text-green-400 text-sm">
                <div>STATUS: MISSION COMPLETE</div>
                <div>PROTOCOL: SSH-2.0</div>
                <div>ENCRYPTION: AES-256</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const challenge = challenges[currentChallenge - 1];

  // Show waiting screen if game is not active
  if (gameStatus !== 'active') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden font-mono">
        <MatrixRain />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/3 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>

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
                  HACK_THE_FIREWALL.exe - Waiting Room
                </div>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="bg-black border-2 border-green-400 rounded-b-lg px-8 py-6 min-h-[600px] relative z-30" style={{backgroundColor: '#000000'}}>
              {/* Terminal Cursor Blink */}
              <div className="absolute top-6 right-6 w-2 h-4 bg-green-400 animate-pulse"></div>

              <div className="text-center max-w-2xl mx-auto mt-20">
                <div className="animate-pulse mb-8">
                  <h1 className="text-4xl sm:text-6xl text-green-300 mb-4 drop-shadow-lg leading-tight">WAITING FOR START</h1>
                  <h2 className="text-2xl sm:text-3xl text-green-200 mb-6 leading-relaxed">GAME NOT ACTIVE YET</h2>
                </div>
                
                <div className="bg-gray-900 border border-green-500 rounded-lg shadow-lg shadow-green-500/20 max-w-lg mx-auto">
                  <div className="p-6 sm:p-8">
                    <div className="text-6xl mb-6">⏳</div>
                    <p className="text-green-300 text-xl sm:text-2xl mb-4 font-bold">REGISTRATION COMPLETE</p>
                    <p className="text-gray-200 text-base sm:text-lg mb-6 leading-relaxed">
                      {gameStatus === 'waiting' 
                        ? 'You have successfully registered! Please wait for the admin to start the game.' 
                        : 'The game has been stopped by the admin. Please wait for it to restart.'
                      }
                    </p>
                    <div className="text-yellow-400 text-sm">
                      This page will automatically update when the game starts.
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="mt-8 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-yellow-600">STATUS: {gameStatus.toUpperCase()}</span>
                  </div>
                  <div className="text-gray-500">
                    <span className="text-green-400">[</span> USER ID: {userId.slice(0, 8)}... <span className="text-green-400">]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-4 mt-2 z-30 relative" style={{backgroundColor: '#111827'}}>
              <div className="flex items-center justify-between text-green-400 text-sm">
                <div>STATUS: WAITING</div>
                <div>PROTOCOL: SSH-2.0</div>
                <div>ENCRYPTION: AES-256</div>
              </div>
            </div>
          </div>
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
          <div className="bg-gray-800 border-2 border-green-400 rounded-t-lg p-4 mb-2 z-30 relative" style={{backgroundColor: '#1f2937'}}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-green-300 text-sm ml-4 font-semibold">
                HACK_THE_FIREWALL.exe - Challenge Terminal
              </div>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="bg-black border-2 border-green-400 rounded-b-lg px-8 py-6 min-h-[600px] relative z-30" style={{backgroundColor: '#000000'}}>
            {/* Terminal Cursor Blink */}
            <div className="absolute top-6 right-6 w-2 h-4 bg-green-400 animate-pulse"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-green-900">
              <div>
                <h1 className="text-3xl text-green-300 font-bold mb-2">Challenge {currentChallenge} / 5</h1>
                <p className="text-sm text-gray-300">Security breach in progress...</p>
              </div>
              <div className="text-right">
                <div className="text-xl text-green-300 font-bold mb-1">POINTS: {points}</div>
                <div className="text-sm text-gray-400">Progress {Math.round((currentChallenge / 5) * 100)}%</div>
              </div>
            </div>

            {/* Challenge card */}
            <div className="bg-gray-900 border border-green-700 rounded-lg shadow-lg shadow-green-700/10 mb-8 opacity-100">
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl text-green-300 mb-4 font-bold">{challenge.title}</h2>
                  <p className="text-gray-200 text-lg leading-relaxed">{challenge.description}</p>
                </div>
                <div className="bg-black border border-green-800 rounded-lg p-6 mb-8">
                  <p className="text-green-300 text-lg font-semibold mb-4">CHALLENGE:</p>
                  <p className="text-white text-lg leading-relaxed mb-4">{challenge.question}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {challenge.type === 'multiple-choice' ? (
                    <div className="space-y-4">
                      {challenge.options?.map((option, index) => (
                        <label key={index} className="flex items-center space-x-4 cursor-pointer p-4 border border-gray-700 rounded-lg hover:border-green-700 hover:bg-gray-800/50 transition-all duration-200">
                          <input type="radio" name="answer" value={option} checked={answer === option} onChange={(e) => setAnswer(e.target.value)} className="text-green-500 focus:ring-green-500" disabled={loading} />
                          <span className="text-gray-200 text-base leading-relaxed">{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="block text-green-300 text-base font-medium mb-3">
                        &gt; {challenge.placeholder || 'Enter your answer'}:
                      </label>
                      <input 
                        type="text" 
                        value={answer} 
                        onChange={(e) => setAnswer(e.target.value)} 
                        className="w-full bg-black border-2 border-green-700 text-black font-mono px-6 py-5 text-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200" 
                        placeholder={challenge.placeholder} 
                        disabled={loading} 
                        required 
                      />
                    </div>
                  )}

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={loading || !answer.trim()} 
                      className="w-full bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600 text-black font-mono py-5 px-8 text-lg font-medium border-2 border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/30"
                    >
                      {loading ? 'PROCESSING...' : 'EXECUTE HACK >>'}
                    </button>
                  </div>

                  {feedback && (
                    <div className={`mt-6 p-4 border rounded-lg font-medium text-base ${
                      feedback.includes('GRANTED') ? 'border-green-500 bg-green-900/20 text-green-400' : 'border-red-500 bg-red-900/20 text-red-400'
                    }`}>
                      {feedback}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-8 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600">SYSTEM: ACTIVE</span>
                </div>
                <div className="text-gray-500">
                  <span className="text-green-400">[</span> USER ID: {userId.slice(0, 8)}... <span className="text-green-400">]</span>
                </div>
              </div>
              
              {/* Question-specific hints */}
              <div className="bg-gray-800 border border-green-700 rounded p-3 text-xs">
                <div className="text-green-400 font-semibold mb-1">HINT:</div>
                {currentChallenge === 1 && (
                  <div className="text-gray-300 space-y-1">
                    <div>Caesar Cipher Shift: +3</div>
                    <div className="font-mono">a → d, b → e, c → f, ... z → c</div>
                    <div className="font-mono">A → D, B → E, C → F, ... Z → C</div>
                  </div>
                )}
                {currentChallenge === 2 && (
                  <div className="text-gray-300 space-y-1">
                    <div>Binary to ASCII Conversion:</div>
                    <div className="font-mono">a → 01100001, b → 01100010, c → 01100011</div>
                    <div className="font-mono">d → 01100100, e → 01100101, f → 01100110</div>
                    <div className="font-mono">g → 01100111, h → 01101000, i → 01101001</div>
                    <div className="font-mono">j → 01101010, k → 01101011, l → 01101100</div>
                    <div className="font-mono">m → 01101101, n → 01101110, o → 01101111</div>
                    <div className="font-mono">p → 01110000, q → 01110001, r → 01110010</div>
                    <div className="font-mono">s → 01110011, t → 01110100, u → 01110101</div>
                    <div className="font-mono">v → 01110110, w → 01110111, x → 01111000</div>
                    <div className="font-mono">y → 01111001, z → 01111010</div>
                    <div className="font-mono">A → 01000001, B → 01000010, C → 01000011</div>
                    <div className="font-mono">D → 01000100, E → 01000101, F → 01000110</div>
                    <div className="font-mono">G → 01000111, H → 01001000, I → 01001001</div>
                    <div className="font-mono">J → 01001010, K → 01001011, L → 01001100</div>
                    <div className="font-mono">M → 01001101, N → 01001110, O → 01001111</div>
                    <div className="font-mono">P → 01010000, Q → 01010001, R → 01010010</div>
                    <div className="font-mono">S → 01010011, T → 01010100, U → 01010101</div>
                    <div className="font-mono">V → 01010110, W → 01010111, X → 01011000</div>
                    <div className="font-mono">Y → 01011001, Z → 01011010</div>
                  </div>
                )}
                {currentChallenge === 3 && (
                  <div className="text-gray-300 space-y-1">
                    <div>HTTP Protocol:</div>
                    <div className="font-mono">HyperText Transfer Protocol</div>
                    <div className="font-mono">Used for web communication</div>
                  </div>
                )}
                {currentChallenge === 4 && (
                  <div className="text-gray-300 space-y-1">
                    <div>SQL Knowledge:</div>
                    <div className="font-mono">Used for database operations</div>
                  </div>
                )}
                {currentChallenge === 5 && (
                  <div className="text-gray-300 space-y-1">
                    <div>Jamia Hamdard Coding Community:</div>
                    <div className="font-mono">H*c**d b* **</div>
                    <div className="font-mono">Best coding community</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-4 mt-2 z-30 relative" style={{backgroundColor: '#111827'}}>
            <div className="flex items-center justify-between text-green-400 text-sm">
              <div>STATUS: CHALLENGE {currentChallenge}/5</div>
              <div>PROTOCOL: SSH-2.0</div>
              <div>ENCRYPTION: AES-256</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}