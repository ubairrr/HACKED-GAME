'use client';

import { useEffect, useRef, useState } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters including Japanese katakana, numbers and symbols
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to store drop positions for each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    // Animation function
    const draw = () => {
      // Black background with slight transparency for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = '#00ff41'; // Matrix green
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';

      // Draw falling characters
      for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize + fontSize / 2;
        const y = drops[i] * fontSize;

        // Add glow effect
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;
        ctx.fillText(char, x, y);
        
        // Reset shadow for next iteration
        ctx.shadowBlur = 0;

        // Move drop down or reset to top
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Start animation
    const animationId = setInterval(draw, 35);

    // Cleanup
    return () => {
      clearInterval(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'black',
        filter: 'contrast(1.2) brightness(1.1)',
        opacity: 0.2
      }}
    />
  );
}
