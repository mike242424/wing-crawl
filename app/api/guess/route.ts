import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  const { userId, guessWhoWillWin } = await req.json();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { guessWhoWillWin },
    });

    return NextResponse.json(
      { message: 'Guess saved successfully.' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error saving guess.' },
      { status: 500 },
    );
  }
}
