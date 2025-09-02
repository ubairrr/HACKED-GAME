import { NextResponse } from 'next/server';
import { getGameStatus, setGameStatus } from '../../lib/gameStatus';

export async function GET() {
  return NextResponse.json({ status: getGameStatus() });
}

export async function POST(request: Request) {
  try {
    const { status } = await request.json();
    
    if (['waiting', 'active', 'stopped'].includes(status)) {
      setGameStatus(status);
      return NextResponse.json({ status: getGameStatus() });
    } else {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating game status:', error);
    return NextResponse.json({ error: 'Failed to update game status' }, { status: 500 });
  }
}
