import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getGameStatus, setGameStatus } from '../../lib/gameStatus';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'start':
        setGameStatus('active');
        return NextResponse.json({ 
          message: 'Game started successfully',
          status: getGameStatus() 
        });
        
      case 'stop':
        setGameStatus('stopped');
        return NextResponse.json({ 
          message: 'Game stopped successfully',
          status: getGameStatus() 
        });
        
      case 'reset':
        // Reset game status and clear all data
        setGameStatus('waiting');
        await prisma.user.deleteMany({});
        return NextResponse.json({ 
          message: 'Game reset successfully',
          status: getGameStatus() 
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in game control:', error);
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 });
  }
}
