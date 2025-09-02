import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const challenges = [
  {
    id: 1,
    question: "Decrypt this Caesar cipher (shift of 3): Khoor",
    answer: "Hello"
  },
  {
    id: 2,
    question: "Decode this binary: 01001000 01001001",
    answer: "HI"
  },
  {
    id: 3,
    question: "What does 'HTTP' stand for?",
    answer: "HyperText Transfer Protocol"
  },
  {
    id: 4,
    question: "What does 'SQL' stand for?",
    options: ["Standard Query Language", "Structured Query Language", "Simple Query Language", "System Query Language"],
    answer: "Structured Query Language"
  },
  {
    id: 5,
    question: "Final riddle: What message appears when you successfully breach a system? (format: 'Hacked by __')",
    answer: "Hacked by JH"
  }
];

export async function POST(request: NextRequest) {
  try {
    const { userId, challengeId, answer } = await request.json();

    if (!userId || !challengeId || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json(
        { error: 'Invalid challenge' },
        { status: 400 }
      );
    }

    const isCorrect = challenge.answer.toLowerCase() === answer.toLowerCase();
    
    if (isCorrect) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          points: user.points + 10,
          ...(challengeId === 5 ? { 
            status: 'Completed',
            finish_time: new Date()
          } : {})
        },
      });

      return NextResponse.json({ 
        correct: true, 
        user: updatedUser,
        isComplete: challengeId === 5
      });
    } else {
      return NextResponse.json({ correct: false });
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}