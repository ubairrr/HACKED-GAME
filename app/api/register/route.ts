import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, roll } = await request.json();

    if (!name || !roll) {
      return NextResponse.json(
        { error: 'Name and roll number are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        roll,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}