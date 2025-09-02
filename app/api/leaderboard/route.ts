import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        roll: true,
        points: true,
        status: true,
        start_time: true,
        finish_time: true,
      },
    });

    // Calculate time elapsed for each user
    const usersWithTime = users.map(user => ({
      ...user,
      timeElapsed: user.finish_time 
        ? Math.round((user.finish_time.getTime() - user.start_time.getTime()) / 1000)
        : null
    }));

    // Sort by: 1. Status (Completed first), 2. Points (higher first), 3. Time (faster first for completed users)
    const sortedUsers = usersWithTime.sort((a, b) => {
      // First priority: Completed status
      if (a.status === 'Completed' && b.status !== 'Completed') return -1;
      if (a.status !== 'Completed' && b.status === 'Completed') return 1;
      
      // Second priority: Points (higher is better)
      if (a.points !== b.points) return b.points - a.points;
      
      // Third priority: Time (for completed users, faster is better)
      if (a.status === 'Completed' && b.status === 'Completed') {
        if (a.timeElapsed && b.timeElapsed) {
          return a.timeElapsed - b.timeElapsed; // Faster time wins
        }
      }
      
      // Default: maintain original order
      return 0;
    });

    const leaderboard = sortedUsers.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      roll: user.roll,
      points: user.points,
      status: user.status,
      timeElapsed: user.timeElapsed
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Delete all users from the database
    await prisma.user.deleteMany({});
    
    return NextResponse.json({ message: 'Leaderboard reset successfully' });
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
    return NextResponse.json({ error: 'Failed to reset leaderboard' }, { status: 500 });
  }
}